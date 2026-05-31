#!/usr/bin/env python3
"""Clean generated illustration alpha masks.

The generated PNGs sometimes contain faint background speckles and
transparent holes inside the bird body. Those are mostly invisible on a
light page, but become obvious in dark mode. This keeps real bird pixels,
removes detached dust, and fills enclosed transparent holes from nearby
feather colors.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


ALPHA_MIN = 8
MIN_COMPONENT = 64
MIN_HOLE = 16


def neighbors4(x: int, y: int) -> tuple[tuple[int, int], ...]:
    return ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))


def clean(path: Path) -> bool:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    width, height = im.size

    def opaque(x: int, y: int) -> bool:
        return px[x, y][3] >= ALPHA_MIN

    # Keep the bird and any meaningful detached parts; drop dust.
    seen: set[tuple[int, int]] = set()
    components: list[list[tuple[int, int]]] = []
    queue: deque[tuple[int, int]] = deque()
    for y in range(height):
        for x in range(width):
            if (x, y) in seen or not opaque(x, y):
                continue
            component: list[tuple[int, int]] = []
            seen.add((x, y))
            queue.append((x, y))
            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                for nx, ny in neighbors4(cx, cy):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and (nx, ny) not in seen
                        and opaque(nx, ny)
                    ):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            components.append(component)
    if not components:
        return False

    largest = max(len(component) for component in components)
    keep_min = max(MIN_COMPONENT, int(largest * 0.002))
    keep = {xy for component in components if len(component) >= keep_min for xy in component}

    changed = False
    for y in range(height):
        for x in range(width):
            if (x, y) not in keep and px[x, y][3] != 0:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)
                changed = True

    def transparent(x: int, y: int) -> bool:
        return px[x, y][3] < ALPHA_MIN

    # Mark exterior transparency by flood filling from the canvas edge.
    exterior: set[tuple[int, int]] = set()
    queue.clear()
    for x in range(width):
        for y in (0, height - 1):
            if transparent(x, y) and (x, y) not in exterior:
                exterior.add((x, y))
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if transparent(x, y) and (x, y) not in exterior:
                exterior.add((x, y))
                queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in neighbors4(x, y):
            if (
                0 <= nx < width
                and 0 <= ny < height
                and (nx, ny) not in exterior
                and transparent(nx, ny)
            ):
                exterior.add((nx, ny))
                queue.append((nx, ny))

    # Remaining transparent components are enclosed holes. Fill them by
    # propagating nearest boundary color inward.
    seen = set(exterior)
    for y in range(height):
        for x in range(width):
            if (x, y) in seen or not transparent(x, y):
                continue
            hole: set[tuple[int, int]] = set()
            seen.add((x, y))
            queue.append((x, y))
            while queue:
                cx, cy = queue.popleft()
                hole.add((cx, cy))
                for nx, ny in neighbors4(cx, cy):
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and (nx, ny) not in seen
                        and transparent(nx, ny)
                    ):
                        seen.add((nx, ny))
                        queue.append((nx, ny))
            if len(hole) < MIN_HOLE:
                continue

            fill_queue: deque[tuple[int, int]] = deque()
            for hx, hy in hole:
                for nx, ny in neighbors4(hx, hy):
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in hole and px[nx, ny][3] >= ALPHA_MIN:
                        fill_queue.append((hx, hy))
                        break

            remaining = set(hole)
            while fill_queue and remaining:
                hx, hy = fill_queue.popleft()
                if (hx, hy) not in remaining:
                    continue
                samples = [
                    px[nx, ny]
                    for nx, ny in neighbors4(hx, hy)
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in remaining and px[nx, ny][3] >= ALPHA_MIN
                ]
                if not samples:
                    continue
                # Nearest-boundary propagation: use the strongest nearby
                # source color instead of averaging the whole hole.
                r, g, b, _ = max(samples, key=lambda c: c[3])
                px[hx, hy] = (r, g, b, 255)
                remaining.remove((hx, hy))
                changed = True
                for nx, ny in neighbors4(hx, hy):
                    if (nx, ny) in remaining:
                        fill_queue.append((nx, ny))

    if changed:
        im.save(path)
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
