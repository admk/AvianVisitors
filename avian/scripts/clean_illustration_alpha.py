#!/usr/bin/env python3
"""Clean generated illustration alpha masks for dark backgrounds.

Build a full bird silhouette, fill holes in that silhouette, shrink its
outer edge, use it as a cream paper backing, then composite the original
PNG over that backing.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ALPHA_MIN = 8
MIN_COMPONENT = 64
PAPER = (244, 232, 202)
MIN_FILTER_SIZE = 5


def neighbors4(x: int, y: int) -> tuple[tuple[int, int], ...]:
    return ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))


def components(mask: list[bytearray], width: int, height: int) -> list[list[tuple[int, int]]]:
    seen = [[False] * width for _ in range(height)]
    out: list[list[tuple[int, int]]] = []
    queue: deque[tuple[int, int]] = deque()
    for y in range(height):
        for x in range(width):
            if seen[y][x] or not mask[y][x]:
                continue
            comp: list[tuple[int, int]] = []
            seen[y][x] = True
            queue.append((x, y))
            while queue:
                cx, cy = queue.popleft()
                comp.append((cx, cy))
                for nx, ny in neighbors4(cx, cy):
                    if 0 <= nx < width and 0 <= ny < height and not seen[ny][nx] and mask[ny][nx]:
                        seen[ny][nx] = True
                        queue.append((nx, ny))
            out.append(comp)
    return out


def fill_holes(mask: Image.Image) -> Image.Image:
    width, height = mask.size
    src = mask.load()
    exterior = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    def add(x: int, y: int) -> None:
        if src[x, y] == 0 and not exterior[y][x]:
            exterior[y][x] = True
            queue.append((x, y))

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in neighbors4(x, y):
            if 0 <= nx < width and 0 <= ny < height and src[nx, ny] == 0 and not exterior[ny][nx]:
                exterior[ny][nx] = True
                queue.append((nx, ny))

    out = Image.new("L", mask.size, 0)
    dst = out.load()
    for y in range(height):
        for x in range(width):
            if src[x, y] or not exterior[y][x]:
                dst[x, y] = 255
    return out


def clean(path: Path) -> bool:
    original = Image.open(path).convert("RGBA")
    px = original.load()
    width, height = original.size

    opaque = [
        bytearray(1 if px[x, y][3] >= ALPHA_MIN else 0 for x in range(width))
        for y in range(height)
    ]
    comps = components(opaque, width, height)
    if not comps:
        return False

    largest = max(len(comp) for comp in comps)
    keep_min = max(MIN_COMPONENT, int(largest * 0.002))
    silhouette = Image.new("L", (width, height), 0)
    sp = silhouette.load()
    keep = set()
    for comp in comps:
        if len(comp) >= keep_min:
            for x, y in comp:
                sp[x, y] = 255
                keep.add((x, y))

    filled_silhouette = fill_holes(silhouette)
    backing_mask = filled_silhouette.filter(ImageFilter.MinFilter(MIN_FILTER_SIZE))

    cream = Image.new("RGBA", (width, height), (*PAPER, 255))
    cream.putalpha(backing_mask)

    cleaned_original = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    co = cleaned_original.load()
    changed = False
    for y in range(height):
        for x in range(width):
            if (x, y) in keep:
                co[x, y] = px[x, y]
            elif px[x, y][3] != 0:
                changed = True

    out = Image.alpha_composite(cream, cleaned_original)
    if out.tobytes() != original.tobytes():
        changed = True
    if changed:
        out.save(path)
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    args = parser.parse_args()

    changed = 0
    for path in sorted(args.root.glob("*.png")):
        if clean(path):
            changed += 1
    print(f"cleaned {changed} illustration PNGs")


if __name__ == "__main__":
    main()
