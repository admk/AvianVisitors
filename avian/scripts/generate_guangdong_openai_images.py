#!/usr/bin/env python3
"""Generate missing Guangdong illustration PNGs with the imagegen CLI.

This is a resumable wrapper around the Codex imagegen skill CLI. It:

1. loads API/proxy settings from .env,
2. builds a Guangdong (CN-44) species list from eBird,
3. keeps only species present in the local BirdNET labels file,
4. skips any per-pose PNG already present in avian/assets/illustrations,
5. reuses any already-created alpha PNGs from previous test/full runs,
6. generates only missing source PNGs with gpt-image-2, and
7. chroma-keys sources into final illustration PNGs.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
import urllib.request


RETRYABLE_OPENAI_PATTERNS = (
    "APIConnectionError",
    "APITimeoutError",
    "APIStatusError",
    "InternalServerError",
    "RateLimitError",
    "ServiceUnavailableError",
    "Connection error",
    "connection error",
    "timed out",
    "timeout",
    "429",
    "500",
    "502",
    "503",
    "504",
    "529",
    "auth_unavailable",
    "no auth available",
    )

POSES = {
    1: "perched in a natural alert posture with folded wings",
    2: "in flight with both wings extended in a natural flapping position",
}


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def slugify(sci: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", sci.lower()).strip("-")


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

    # urllib/openai honor the uppercase names reliably; keep lowercase too.
    for lower, upper in (
        ("http_proxy", "HTTP_PROXY"),
        ("https_proxy", "HTTPS_PROXY"),
        ("all_proxy", "ALL_PROXY"),
        ("no_proxy", "NO_PROXY"),
    ):
        if os.environ.get(lower) and not os.environ.get(upper):
            os.environ[upper] = os.environ[lower]


def first_existing(paths: list[Path]) -> Path | None:
    for path in paths:
        if path.exists():
            return path
    return None


def resolve_imagegen_cli(root: Path) -> Path:
    candidates: list[Path] = []
    if os.environ.get("IMAGE_GEN_CLI"):
        candidates.append(Path(os.environ["IMAGE_GEN_CLI"]).expanduser())
    codex_home = Path(os.environ.get("CODEX_HOME", "~/.codex")).expanduser()
    candidates.append(codex_home / "skills/.system/imagegen/scripts/image_gen.py")
    candidates.append(Path("~/.codex/skills/.system/imagegen/scripts/image_gen.py").expanduser())
    candidates.append(
        Path("~/.kxh/.config/codex/skills/.system/imagegen/scripts/image_gen.py").expanduser()
    )
    found = first_existing(candidates)
    if not found:
        raise SystemExit("imagegen CLI not found; set IMAGE_GEN_CLI=/path/to/image_gen.py")
    return found


def resolve_remove_chroma(root: Path) -> Path:
    candidates: list[Path] = []
    if os.environ.get("REMOVE_CHROMA_KEY"):
        candidates.append(Path(os.environ["REMOVE_CHROMA_KEY"]).expanduser())
    codex_home = Path(os.environ.get("CODEX_HOME", "~/.codex")).expanduser()
    candidates.append(codex_home / "skills/.system/imagegen/scripts/remove_chroma_key.py")
    candidates.append(Path("~/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py").expanduser())
    candidates.append(
        Path("~/.kxh/.config/codex/skills/.system/imagegen/scripts/remove_chroma_key.py").expanduser()
    )
    found = first_existing(candidates)
    if not found:
        raise SystemExit("remove_chroma_key.py not found; set REMOVE_CHROMA_KEY=/path/to/script")
    return found


def python_can_import(python: Path, modules: list[str]) -> bool:
    imports = "; ".join(f"import {module}" for module in modules)
    result = subprocess.run(
        [str(python), "-c", imports],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    return result.returncode == 0


def resolve_python(
    *,
    env_var: str,
    modules: list[str],
    purpose: str,
    candidates: list[Path],
) -> str:
    if os.environ.get(env_var):
        candidate = Path(os.environ[env_var]).expanduser()
        if candidate.exists() and python_can_import(candidate, modules):
            return str(candidate)
        raise SystemExit(
            f"{env_var}={candidate} cannot import required modules for {purpose}: "
            + ", ".join(modules)
        )

    for candidate in candidates:
        if candidate.exists() and python_can_import(candidate, modules):
            return str(candidate)
    raise SystemExit(
        f"No Python found for {purpose}; required modules: " + ", ".join(modules)
    )


def fetch_json(url: str, api_key: str) -> object:
    req = urllib.request.Request(url, headers={"X-eBirdApiToken": api_key})
    with urllib.request.urlopen(req, timeout=120) as response:
        return json.loads(response.read())


def guangdong_species(region: str, api_key: str) -> list[tuple[str, str]]:
    codes = set(fetch_json(f"https://api.ebird.org/v2/product/spplist/{region}", api_key))
    taxonomy = fetch_json("https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json", api_key)
    code_to_pair = {
        item["speciesCode"]: (item["sciName"], item["comName"])
        for item in taxonomy
        if item.get("category") == "species"
        and item.get("speciesCode")
        and item.get("sciName")
        and item.get("comName")
    }
    return sorted({code_to_pair[code] for code in codes if code in code_to_pair})


def filename_for(sci: str, pose: int) -> str:
    stem = slugify(sci)
    return f"{stem}.png" if pose == 1 else f"{stem}-{pose}.png"


def slug_from_illustration_filename(path: Path) -> str:
    stem = path.stem
    return stem[:-2] if stem.endswith("-2") else stem


def illustration_species_slugs(path: Path) -> set[str]:
    if not path.exists():
        raise SystemExit(f"illustration filter directory does not exist: {path}")
    return {slug_from_illustration_filename(item) for item in path.glob("*.png")}


def prompt_for(sci: str, common: str, pose: int) -> str:
    return (
        f"Create a single {POSES[pose]} {common} ({sci}) in the style of an "
        "Edo-period Japanese kachō-e woodblock print. Confident sumi-e ink "
        "linework with soft watercolor washes; earthy restrained palette with "
        "burnt umber, ochre, indigo, vermillion, and muted greens. Accurate bird "
        "proportions and plumage for the named species. The bird is the only "
        "subject. Use a perfectly flat solid #00ff00 chroma-key background for "
        "background removal. No branch unless needed for the perched pose, and "
        "if present use only one sparse twig. No text, no signature, no border, "
        "no frame, no watermark, no shadow, no gradient, no texture in the "
        "background. Keep the whole bird visible with generous padding."
    )


def image_job(sci: str, common: str, pose: int) -> dict[str, object]:
    return {
        "model": "gpt-image-2",
        "prompt": prompt_for(sci, common, pose),
        "use_case": "illustration-story",
        "style": "Edo-period Japanese kachō-e woodblock print, chroma-key asset source",
        "composition": "single bird centered, full body visible, generous padding",
        "constraints": "flat #00ff00 background only; no text; no watermark; no frame; bird only",
        "negative": (
            "photorealistic photo, multiple birds, scenery, complex background, text, "
            "signature, watermark, cropped body, extra limbs, distorted anatomy"
        ),
        "quality": "low",
        "size": "1024x1024",
        "output_format": "png",
        "out": filename_for(sci, pose),
    }


def large_enough(path: Path) -> bool:
    return path.exists() and path.stat().st_size > 1024


def copy_existing_alpha(filename: str, alpha_dirs: list[Path], target: Path, *, dry_run: bool) -> bool:
    for alpha_dir in alpha_dirs:
        candidate = alpha_dir / filename
        if large_enough(candidate):
            if not dry_run:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(candidate, target)
            print(f"[reuse] {candidate} -> {target}")
            return True
    return False


def run_chroma(
    *,
    postprocess_python: str,
    remove_chroma: Path,
    source: Path,
    alpha: Path,
    target: Path,
    dry_run: bool,
) -> bool:
    if not large_enough(source):
        return False
    if not large_enough(alpha):
        cmd = [
            postprocess_python,
            str(remove_chroma),
            "--input",
            str(source),
            "--out",
            str(alpha),
            "--auto-key",
            "border",
            "--soft-matte",
            "--transparent-threshold",
            "12",
            "--opaque-threshold",
            "220",
            "--despill",
        ]
        print("[alpha] " + " ".join(cmd))
        if not dry_run:
            subprocess.run(cmd, check=True)
    if large_enough(alpha):
        target.parent.mkdir(parents=True, exist_ok=True)
        if not dry_run:
            shutil.copy2(alpha, target)
        print(f"[install] {alpha} -> {target}")
        return True
    return False


def chunks(items: list[dict[str, object]], size: int) -> list[list[dict[str, object]]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def install_generated_outputs(
    *,
    batch: list[dict[str, object]],
    postprocess_python: str,
    remove_chroma: Path,
    source_dir: Path,
    alpha_dir: Path,
    illustrations: Path,
) -> list[dict[str, object]]:
    remaining: list[dict[str, object]] = []
    for job in batch:
        filename = str(job["out"])
        target = illustrations / filename
        if large_enough(target):
            continue
        installed = run_chroma(
            postprocess_python=postprocess_python,
            remove_chroma=remove_chroma,
            source=source_dir / filename,
            alpha=alpha_dir / filename,
            target=target,
            dry_run=False,
        )
        if not installed:
            remaining.append(job)
    return remaining


def run_generate_batch(
    *,
    imagegen_python: str,
    imagegen_cli: Path,
    work_dir: Path,
    batch_index: int,
    attempt: int,
    batch: list[dict[str, object]],
    source_dir: Path,
    concurrency: int,
    max_attempts: int,
    dry_run: bool,
) -> tuple[int, str]:
    batch_file = work_dir / f"batch-{batch_index:03d}-attempt-{attempt:02d}.jsonl"
    batch_file.write_text("\n".join(json.dumps(job, ensure_ascii=False) for job in batch) + "\n")
    cmd = [
        imagegen_python,
        str(imagegen_cli),
        "generate-batch",
        "--input",
        str(batch_file),
        "--out-dir",
        str(source_dir),
        "--concurrency",
        str(concurrency),
        "--max-attempts",
        str(max_attempts),
    ]
    print("[generate] " + " ".join(cmd), flush=True)
    if dry_run:
        return 0, ""
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    output_lines: list[str] = []
    assert process.stdout is not None
    for line in process.stdout:
        print(line, end="", flush=True)
        output_lines.append(line)
    return process.wait(), "".join(output_lines)


def is_retryable_openai_error(output: str) -> bool:
    return any(pattern in output for pattern in RETRYABLE_OPENAI_PATTERNS)


def main() -> int:
    root = repo_root()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--region", default="CN-44")
    parser.add_argument("--labels", type=Path, default=root / "model/BirdNET_GLOBAL_6K_V2.4_Model_FP16_Labels.txt")
    parser.add_argument("--illustrations", type=Path, default=root / "avian/assets/illustrations")
    parser.add_argument("--source-dir", type=Path, default=root / "output/imagegen/guangdong-openai/source")
    parser.add_argument("--alpha-dir", type=Path, default=root / "output/imagegen/guangdong-openai/alpha")
    parser.add_argument(
        "--reuse-alpha-dir",
        action="append",
        type=Path,
        default=[root / "output/imagegen/guangdong-test/alpha"],
        help="Existing alpha directory to reuse before generating; can be repeated.",
    )
    parser.add_argument("--work-dir", type=Path, default=root / "tmp/imagegen/guangdong-openai")
    parser.add_argument("--concurrency", type=int, default=2)
    parser.add_argument("--max-attempts", type=int, default=2)
    parser.add_argument(
        "--chunk-retries",
        type=int,
        default=8,
        help="Wrapper-level retries for still-missing jobs after a batch command fails.",
    )
    parser.add_argument(
        "--retry-initial-delay",
        type=float,
        default=60.0,
        help="Initial wrapper retry delay in seconds.",
    )
    parser.add_argument(
        "--retry-max-delay",
        type=float,
        default=900.0,
        help="Maximum wrapper retry delay in seconds.",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=50,
        help="Number of imagegen jobs per batch file. Concurrency is controlled separately.",
    )
    parser.add_argument(
        "--only-species-from-illustrations-dir",
        type=Path,
        default=None,
        help=(
            "Restrict work to species whose slug appears in this illustration directory. "
            "Useful for regenerating only files moved to a backup directory."
        ),
    )
    parser.add_argument("--limit", type=int, default=0, help="Limit generated source jobs for testing.")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_dotenv(root / ".env")
    if not os.environ.get("EBIRD_API_KEY"):
        raise SystemExit("EBIRD_API_KEY is required in environment or .env")
    if not os.environ.get("OPENAI_API_KEY"):
        raise SystemExit("OPENAI_API_KEY is required in environment or .env")

    imagegen_python = resolve_python(
        env_var="IMAGEGEN_PYTHON",
        modules=["openai"],
        purpose="image generation",
        candidates=[
            Path("~/.kxh/.venv/bin/python").expanduser(),
            Path("~/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3").expanduser(),
            Path("/opt/homebrew/bin/python3.12"),
            Path("/opt/homebrew/bin/python3.11"),
            Path(sys.executable),
        ],
    )
    postprocess_python = resolve_python(
        env_var="IMAGEGEN_POSTPROCESS_PYTHON",
        modules=["PIL"],
        purpose="chroma-key post-processing",
        candidates=[
            Path("~/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3").expanduser(),
            Path("~/.kxh/.venv/bin/python").expanduser(),
            Path("/opt/homebrew/bin/python3.12"),
            Path("/opt/homebrew/bin/python3.11"),
            Path(sys.executable),
        ],
    )
    print(f"[env] imagegen_python={imagegen_python}", flush=True)
    print(f"[env] postprocess_python={postprocess_python}", flush=True)
    imagegen_cli = resolve_imagegen_cli(root)
    remove_chroma = resolve_remove_chroma(root)
    labels = {line.strip() for line in args.labels.read_text().splitlines() if line.strip()}
    species = [(sci, common) for sci, common in guangdong_species(args.region, os.environ["EBIRD_API_KEY"]) if sci in labels]
    only_species_slugs = (
        illustration_species_slugs(args.only_species_from_illustrations_dir)
        if args.only_species_from_illustrations_dir
        else None
    )

    args.source_dir.mkdir(parents=True, exist_ok=True)
    args.alpha_dir.mkdir(parents=True, exist_ok=True)
    args.work_dir.mkdir(parents=True, exist_ok=True)

    reuse_alpha_dirs = [args.alpha_dir] + args.reuse_alpha_dir
    jobs: list[dict[str, object]] = []
    seen = skipped_final = reused_alpha = processed_source = 0

    for sci, common in species:
        if only_species_slugs is not None and slugify(sci) not in only_species_slugs:
            continue
        for pose in (1, 2):
            seen += 1
            filename = filename_for(sci, pose)
            target = args.illustrations / filename
            alpha = args.alpha_dir / filename
            source = args.source_dir / filename
            if large_enough(target):
                skipped_final += 1
                continue
            if copy_existing_alpha(filename, reuse_alpha_dirs, target, dry_run=args.dry_run):
                reused_alpha += 1
                continue
            if run_chroma(
                postprocess_python=postprocess_python,
                remove_chroma=remove_chroma,
                source=source,
                alpha=alpha,
                target=target,
                dry_run=args.dry_run,
            ):
                processed_source += 1
                continue
            jobs.append(image_job(sci, common, pose))

    if args.limit:
        jobs = jobs[: args.limit]

    print(
        f"[plan] species={len(species)} targets={seen} "
        f"existing={skipped_final} reused_alpha={reused_alpha} "
        f"processed_source={processed_source} to_generate={len(jobs)}"
    )
    if only_species_slugs is not None:
        print(
            f"[filter] only_species_from_illustrations_dir="
            f"{args.only_species_from_illustrations_dir} matched_targets={seen}",
            flush=True,
        )

    if not jobs:
        return 0

    for index, batch in enumerate(chunks(jobs, args.chunk_size), start=1):
        if args.dry_run:
            run_generate_batch(
                imagegen_python=imagegen_python,
                imagegen_cli=imagegen_cli,
                work_dir=args.work_dir,
                batch_index=index,
                attempt=1,
                batch=batch,
                source_dir=args.source_dir,
                concurrency=args.concurrency,
                max_attempts=args.max_attempts,
                dry_run=True,
            )
            continue

        remaining = batch
        delay = args.retry_initial_delay
        for attempt in range(1, args.chunk_retries + 2):
            returncode, generate_output = run_generate_batch(
                imagegen_python=imagegen_python,
                imagegen_cli=imagegen_cli,
                work_dir=args.work_dir,
                batch_index=index,
                attempt=attempt,
                batch=remaining,
                source_dir=args.source_dir,
                concurrency=args.concurrency,
                max_attempts=args.max_attempts,
                dry_run=False,
            )
            # Install everything that succeeded, even if one job in the chunk failed.
            remaining = install_generated_outputs(
                batch=remaining,
                postprocess_python=postprocess_python,
                remove_chroma=remove_chroma,
                source_dir=args.source_dir,
                alpha_dir=args.alpha_dir,
                illustrations=args.illustrations,
            )
            if not remaining:
                if returncode != 0:
                    print(
                        f"[retry] chunk {index:03d} returned {returncode}, "
                        "but all jobs produced usable files",
                        flush=True,
                    )
                break
            if returncode == 0:
                print(
                    f"[retry] chunk {index:03d} returned success but "
                    f"{len(remaining)} jobs are still missing",
                    flush=True,
                )
            if attempt > args.chunk_retries:
                print(
                    f"[error] generation chunk {index:03d} still has "
                    f"{len(remaining)} missing jobs after {attempt} attempts",
                    file=sys.stderr,
                    flush=True,
                )
                return returncode or 1
            if not is_retryable_openai_error(generate_output):
                print(
                    f"[error] generation chunk {index:03d} failed with a "
                    "non-retryable local/config error",
                    file=sys.stderr,
                    flush=True,
                )
                return returncode or 1
            print(
                f"[retry] chunk {index:03d}: {len(remaining)} jobs still missing; "
                f"sleeping {delay:.0f}s before attempt {attempt + 1}",
                flush=True,
            )
            time.sleep(delay)
            delay = min(delay * 2, args.retry_max_delay)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
