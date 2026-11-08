"""Fail if themes/acrylic.yaml drifts off the Acrylic recipe."""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / "themes" / "acrylic.yaml"
BUNDLED = ROOT / "custom_components" / "acrylic" / "acrylic.yaml"
MENUS = ROOT / "custom_components" / "acrylic" / "frontend" / "acrylic-menus.js"
FILTER = "blur(40px) saturate(200%) contrast(1.08)"


def main() -> None:
    text = THEME.read_text(encoding="utf-8")
    errors = []

    def need(label: str, ok: bool) -> None:
        if not ok:
            errors.append(label)

    need("Acrylic Dark theme", "\nAcrylic Dark:\n" in text)
    need("Acrylic Light theme", "\nAcrylic Light:\n" in text)
    need("dark card-mod name", "card-mod-theme: 'Acrylic Dark'" in text)
    need("light card-mod name", "card-mod-theme: 'Acrylic Light'" in text)
    need("acrylic blur", text.count(FILTER) >= 10)
    need("dark tint", "rgba(28, 28, 30, 0.55)" in text)
    need("light tint", "rgba(243, 243, 245, 0.55)" in text)
    need("dark highlight", "inset 0 0.5px 0 rgba(255, 255, 255, 0.14)" in text)
    need("light highlight", "inset 0 0.5px 0 rgba(255, 255, 255, 0.65)" in text)
    need("grain opacity", text.count("opacity: 0.055") >= 8)
    need("8px cards", text.count("ha-card-border-radius: '8px'") == 2)
    need("dark accent", "rgb(128, 109, 241)" in text)
    need("light accent", "rgb(85, 64, 176)" in text)
    need("switch size kept", text.count("ha-switch-thumb-size: '18px'") == 2)
    need("no brightness", "brightness(" not in text)
    need("no photo wallpaper", "background.jpg" not in text)
    need("both mode maps", text.count("\n  modes:\n") == 2)
    need("old dark accent gone", "122, 162, 190" not in text)
    need("old light accent gone", "106, 116, 211" not in text)
    need("menu surfaces", text.count("ha-dropdown::part(menu)") >= 8)
    need("submenu surfaces", text.count("ha-dropdown-item::part(submenu)") >= 8)
    need("picker surfaces", text.count("wa-popover::part(body)") >= 8)
    need("select menus", text.count('"ha-control-select-menu$"') >= 2)
    need("tile select features", text.count("hui-select-options-card-feature$") == 2)
    need("bubble select tint", text.count("bubble-select-list-background-color: 'var(--ha-card-glass-tint)'") == 2)
    need("form select menus", text.count('"hui-view-background-editor$"') == 4)
    need("dropdown menu element", text.count("#menu {") == 8)
    need("deep dropdown search", text.count("$$ ha-dropdown$") == 8)
    need("card yaml kept", text.count("card-mod-card-yaml:") == 2)
    menus = MENUS.read_text(encoding="utf-8")
    need("menu module", "attachShadow" in menus and "#menu, #submenu" in menus)
    need("menu module blur", "var(--ha-card-backdrop-filter)" in menus)
    need("menu module has no brightness", "brightness(" not in menus)
    need("bundled theme matches", BUNDLED.read_bytes() == THEME.read_bytes())

    noises = []
    cursor = 0
    marker = 'acrylic-noise: "'
    while True:
        start = text.find(marker, cursor)
        if start < 0:
            break
        start += len(marker)
        end = text.find('"', start)
        noises.append(text[start:end])
        cursor = end + 1
    need("two noise urls", len(noises) == 2)
    for noise in noises:
        payload = noise.removeprefix("url('data:image/svg+xml,").removesuffix("')")
        svg = unquote(payload)
        need("noise svg", "feTurbulence" in svg and 'width="100%"' in svg and 'filter="url(#n)"' in svg)

    if errors:
        print("\n".join(errors))
        sys.exit(1)
    print("acrylic theme ok")


if __name__ == "__main__":
    main()
