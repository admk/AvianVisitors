#!/usr/bin/env python3
"""Translate local species descriptions into zh-CN with an OpenAI-compatible API."""

from __future__ import annotations

import argparse
import json
import os
import socket
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_STORE = ROOT / "avian/assets/data/species-descriptions.json"
DEFAULT_MODEL = "deepseek-v4-flash"
TARGET_LANG = "zh-CN"


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


def read_store(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("species"), dict):
        raise ValueError(f"{path} does not look like a species description store")
    return data


def write_store(path: Path, store: dict[str, Any]) -> None:
    store["translated_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    path.write_text(json.dumps(store, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def api_url(base_url: str) -> str:
    base = base_url.rstrip("/")
    if base.endswith("/chat/completions"):
        return base
    return base + "/chat/completions"


def extract_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        lines = [line for line in text.splitlines() if not line.strip().startswith("```")]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end >= start:
        text = text[start:end + 1]
    data = json.loads(text)
    if not isinstance(data, dict):
        raise ValueError("translation response was not a JSON object")
    return data


def post_json(
    url: str,
    key: str,
    payload: dict[str, Any],
    proxies: dict[str, str],
    timeout: float,
) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    opener = urllib.request.build_opener(urllib.request.ProxyHandler(proxies))
    try:
        with opener.open(req, timeout=timeout) as res:
            raw = res.read()
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"http {exc.code}: {body}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(str(exc.reason)) from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("timeout") from exc
    data = json.loads(raw.decode("utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError("API response was not an object")
    return data


def translate_batch(
    batch: list[tuple[str, dict[str, Any]]],
    *,
    url: str,
    key: str,
    model: str,
    proxies: dict[str, str],
    timeout: float,
) -> dict[str, dict[str, str]]:
    records = [
        {
            "sci": sci,
            "title": str(item.get("title") or sci),
            "extract": str(item.get("extract") or ""),
        }
        for sci, item in batch
    ]
    payload = {
        "model": model,
        "temperature": 0.1,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Translate bird field-guide summaries from English to Simplified Chinese (zh-CN). "
                    "Preserve scientific names as JSON keys. Keep facts unchanged. "
                    "Return only strict JSON: {\"translations\":{\"Scientific name\":{\"title\":\"...\",\"extract\":\"...\"}}}."
                ),
            },
            {
                "role": "user",
                "content": json.dumps({"records": records}, ensure_ascii=False),
            },
        ],
    }
    data = post_json(url, key, payload, proxies, timeout)
    choices = data.get("choices")
    if not isinstance(choices, list) or not choices:
        raise RuntimeError("API response had no choices")
    message = choices[0].get("message") if isinstance(choices[0], dict) else None
    content = message.get("content") if isinstance(message, dict) else None
    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("API response had empty message content")
    parsed = extract_json(content)
    translations = parsed.get("translations")
    if not isinstance(translations, dict):
        raise RuntimeError("translation response missing translations object")

    out: dict[str, dict[str, str]] = {}
    for sci, _item in batch:
        val = translations.get(sci)
        if not isinstance(val, dict):
            raise RuntimeError(f"translation response missing {sci}")
        title = val.get("title")
        extract = val.get("extract")
        if not isinstance(title, str) or not title.strip() or not isinstance(extract, str) or not extract.strip():
            raise RuntimeError(f"translation response for {sci} was incomplete")
        out[sci] = {"title": title.strip(), "extract": extract.strip()}
    return out


def chunks(items: list[tuple[str, dict[str, Any]]], size: int) -> list[list[tuple[str, dict[str, Any]]]]:
    return [items[i:i + size] for i in range(0, len(items), size)]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--store", type=Path, default=DEFAULT_STORE)
    parser.add_argument("--model", default=os.environ.get("DEEPSEEK_MODEL", DEFAULT_MODEL))
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", ""))
    parser.add_argument("--api-key", default=os.environ.get("OPENAI_API_KEY", ""))
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument("--timeout", type=float, default=60.0)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--sleep", type=float, default=0.4)
    args = parser.parse_args()

    load_dotenv(ROOT / ".env")
    if not args.base_url:
        args.base_url = os.environ.get("OPENAI_BASE_URL", "")
    if not args.api_key:
        args.api_key = os.environ.get("OPENAI_API_KEY", "")
    if not args.base_url or not args.api_key:
        raise SystemExit("OPENAI_BASE_URL and OPENAI_API_KEY are required in environment or .env")

    proxies = proxy_settings()
    if proxies:
        rendered = ", ".join(f"{k}={redacted_proxy(v)}" for k, v in sorted(proxies.items()))
        print(f"Using proxy: {rendered}", flush=True)
    else:
        print("Using proxy: none", flush=True)

    store = read_store(args.store)
    species = store["species"]
    todo = [
        (sci, item)
        for sci, item in sorted(species.items())
        if isinstance(item, dict)
        and item.get("extract")
        and (
            args.refresh
            or not isinstance(item.get("i18n"), dict)
            or not isinstance(item.get("i18n", {}).get(TARGET_LANG), dict)
            or not item.get("i18n", {}).get(TARGET_LANG, {}).get("extract")
        )
    ]
    if args.limit > 0:
        todo = todo[:args.limit]
    if not todo:
        print(f"Nothing to translate; {len(species)} entries already have {TARGET_LANG}.")
        return 0

    endpoint = api_url(args.base_url)
    print(f"Translating {len(todo)} entries with {args.model}...")
    done = 0
    failed: dict[str, str] = {}
    for batch in chunks(todo, max(1, args.batch_size)):
        names = [sci for sci, _item in batch]
        last_err = ""
        for attempt in range(max(0, args.retries) + 1):
            try:
                translations = translate_batch(
                    batch,
                    url=endpoint,
                    key=args.api_key,
                    model=args.model,
                    proxies=proxies,
                    timeout=args.timeout,
                )
                for sci, item in batch:
                    item.setdefault("i18n", {})[TARGET_LANG] = {
                        **translations[sci],
                        "translated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
                        "model": args.model,
                    }
                write_store(args.store, store)
                done += len(batch)
                break
            except Exception as exc:
                last_err = str(exc)
                if attempt < args.retries:
                    time.sleep(1.0 * (attempt + 1))
        else:
            for sci in names:
                failed[sci] = last_err or "unknown error"
        if args.sleep:
            time.sleep(args.sleep)
        total = done + len(failed)
        print(f"  {total}/{len(todo)} complete ({done} saved, {len(failed)} failed)", flush=True)

    if failed:
        store.setdefault("translation_failed", {})[TARGET_LANG] = failed
        write_store(args.store, store)
        print(f"{len(failed)} entries failed; see translation_failed.{TARGET_LANG}.", file=sys.stderr)
    else:
        tf = store.get("translation_failed")
        if isinstance(tf, dict):
            tf.pop(TARGET_LANG, None)
            if not tf:
                store.pop("translation_failed", None)
        write_store(args.store, store)

    return 0 if done else 1


if __name__ == "__main__":
    raise SystemExit(main())
