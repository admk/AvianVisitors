#!/usr/bin/env python3
"""Fetch Wikipedia species summaries into AvianVisitors' local JSON store."""

from __future__ import annotations

import argparse
import json
import os
import socket
import sqlite3
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUTPUT = ROOT / "avian/assets/data/species-descriptions.json"
WIKI_SUMMARY = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
USER_AGENT = "AvianVisitors/1.0 (+https://github.com/Twarner491/AvianVisitors)"


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(errors="ignore").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)

    for lower, upper in (
        ("http_proxy", "HTTP_PROXY"),
        ("https_proxy", "HTTPS_PROXY"),
        ("all_proxy", "ALL_PROXY"),
        ("no_proxy", "NO_PROXY"),
    ):
        if os.environ.get(lower) and not os.environ.get(upper):
            os.environ[upper] = os.environ[lower]


def slug_to_sci(slug: str) -> str:
    parts = [p for p in slug.split("-") if p]
    if not parts:
        return ""
    return " ".join([parts[0].capitalize(), *parts[1:]])


def species_from_assets(root: Path) -> set[str]:
    out: set[str] = set()
    for folder in (root / "avian/assets/illustrations", root / "avian/assets/cutouts"):
        if not folder.is_dir():
            continue
        for path in folder.glob("*.png"):
            slug = path.stem
            if slug.endswith("-2"):
                slug = slug[:-2]
            sci = slug_to_sci(slug)
            if sci:
                out.add(sci)
    return out


def species_from_db(path: Path) -> set[str]:
    if not path.is_file():
        return set()
    con = sqlite3.connect(path)
    try:
        rows = con.execute(
            "SELECT DISTINCT Sci_Name FROM detections WHERE Sci_Name IS NOT NULL AND Sci_Name <> ''"
        ).fetchall()
    finally:
        con.close()
    return {str(row[0]).strip() for row in rows if str(row[0]).strip()}


def species_from_file(path: Path) -> set[str]:
    if not path.is_file():
        raise FileNotFoundError(path)
    out: set[str] = set()
    for raw in path.read_text(errors="ignore").splitlines():
        line = raw.strip()
        if line and not line.startswith("#"):
            out.add(line)
    return out


def read_existing(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {"species": {}}
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError:
        return {"species": {}}
    if not isinstance(data, dict):
        return {"species": {}}
    if not isinstance(data.get("species"), dict):
        data["species"] = {}
    return data


def proxy_settings() -> dict[str, str]:
    proxies: dict[str, str] = {}
    all_proxy = os.environ.get("all_proxy") or os.environ.get("ALL_PROXY")
    for scheme in ("http", "https"):
        value = (
            os.environ.get(f"{scheme}_proxy")
            or os.environ.get(f"{scheme.upper()}_PROXY")
            or all_proxy
        )
        if value:
            proxies[scheme] = value
    return proxies


def redacted_proxy(value: str) -> str:
    parsed = urllib.parse.urlsplit(value)
    if parsed.username or parsed.password:
        netloc = parsed.hostname or ""
        if parsed.port:
            netloc += f":{parsed.port}"
        return urllib.parse.urlunsplit((parsed.scheme, netloc, parsed.path, parsed.query, parsed.fragment))
    return value


def fetch_summary(
    sci: str,
    timeout: float,
    proxies: dict[str, str],
    retries: int,
) -> tuple[str, dict[str, Any] | None, str | None]:
    title = urllib.parse.quote(sci, safe="")
    url = WIKI_SUMMARY.format(title=title)
    req = urllib.request.Request(url, headers={"User-Agent": os.environ.get("AV_USER_AGENT", USER_AGENT)})
    opener = urllib.request.build_opener(urllib.request.ProxyHandler(proxies))
    last_error = "unknown error"
    for attempt in range(retries + 1):
        try:
            with opener.open(req, timeout=timeout) as res:
                raw = res.read()
            break
        except urllib.error.HTTPError as exc:
            return sci, None, f"http {exc.code}"
        except urllib.error.URLError as exc:
            last_error = str(exc.reason)
        except (TimeoutError, socket.timeout):
            last_error = "timeout"
        if attempt < retries:
            time.sleep(0.5 * (attempt + 1))
    else:
        return sci, None, last_error

    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return sci, None, "invalid json"

    extract = data.get("extract")
    if not isinstance(extract, str) or not extract.strip():
        return sci, None, "missing extract"

    thumb = data.get("thumbnail")
    thumb_source = thumb.get("source") if isinstance(thumb, dict) else None
    item: dict[str, Any] = {
        "extract": extract.strip(),
        "title": data.get("title") if isinstance(data.get("title"), str) else sci,
        "source": data.get("content_urls", {}).get("desktop", {}).get("page")
        if isinstance(data.get("content_urls"), dict)
        else f"https://en.wikipedia.org/wiki/{urllib.parse.quote(sci.replace(' ', '_'))}",
        "fetched_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    }
    if isinstance(thumb_source, str) and thumb_source.startswith(("https://upload.wikimedia.org/", "https://commons.wikimedia.org/")):
        item["thumbnail"] = {"source": thumb_source}
    return sci, item, None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--db", type=Path, default=ROOT / "scripts/birds.db")
    parser.add_argument("--species-file", type=Path)
    parser.add_argument("--species", action="append", default=[])
    parser.add_argument("--assets", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--refresh", action="store_true", help="Refetch entries already present in the output file.")
    parser.add_argument("--retry-failed", action="store_true", help="Retry species recorded in the output file's failed map.")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--timeout", type=float, default=15.0)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--sleep", type=float, default=0.0, help="Delay between submitted requests.")
    args = parser.parse_args()

    load_dotenv(ROOT / ".env")
    proxies = proxy_settings()
    if proxies:
        rendered = ", ".join(f"{k}={redacted_proxy(v)}" for k, v in sorted(proxies.items()))
        print(f"Using proxy: {rendered}", flush=True)
    else:
        print("Using proxy: none", flush=True)

    species: set[str] = set(args.species)
    if args.assets:
        species |= species_from_assets(ROOT)
    species |= species_from_db(args.db)
    if args.species_file:
        species |= species_from_file(args.species_file)

    names = sorted(s for s in species if s)
    if args.limit > 0:
        names = names[: args.limit]

    existing = read_existing(args.output)
    store: dict[str, Any] = dict(existing)
    entries: dict[str, Any] = dict(existing.get("species", {}))
    previous_failures = existing.get("failed", {}) if isinstance(existing.get("failed"), dict) else {}
    todo = [
        s for s in names
        if args.refresh
        or (
            (s not in entries or not entries.get(s, {}).get("extract"))
            and (args.retry_failed or s not in previous_failures)
        )
    ]

    if not todo:
        print(
            f"Nothing to fetch; {len(entries)} local descriptions already present"
            f" ({len(previous_failures)} recorded failures)."
        )
        return 0

    print(f"Fetching {len(todo)} of {len(names)} species descriptions...")
    ok = 0
    failed: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = []
        for sci in todo:
            futures.append(pool.submit(fetch_summary, sci, args.timeout, proxies, max(0, args.retries)))
            if args.sleep:
                time.sleep(args.sleep)
        for fut in as_completed(futures):
            sci, item, err = fut.result()
            if item:
                entries[sci] = item
                ok += 1
            else:
                failed[sci] = err or "unknown error"
            done = ok + len(failed)
            if done % 25 == 0 or done == len(todo):
                print(f"  {done}/{len(todo)} complete ({ok} saved, {len(failed)} failed)")

    store.update(
        {
            "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "source": "Wikipedia REST page summary API",
            "species": dict(sorted(entries.items())),
        }
    )
    if failed:
        store["failed"] = dict(sorted(failed.items()))
    else:
        store.pop("failed", None)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(store, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(entries)} descriptions to {args.output}")
    if failed:
        print(f"{len(failed)} species failed; see the 'failed' object in the output.", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
