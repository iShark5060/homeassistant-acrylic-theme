"""Serve the menu script and keep the theme file in sync."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, JS_URL

_LOGGER = logging.getLogger(__name__)
_SRC = Path(__file__).with_name("acrylic.yaml")


def _sync_theme(src: Path, config_dir: str) -> bool:
    """Write the bundled theme over the installed copy. Return True if it changed."""
    themes = Path(config_dir) / "themes"
    direct = themes / "acrylic.yaml"
    nested = themes / "acrylic" / "acrylic.yaml"
    if nested.is_file() or (themes / "acrylic").is_dir():
        dest = nested
    elif direct.is_file():
        dest = direct
    else:
        dest = nested
    data = src.read_bytes()
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_file() and dest.read_bytes() == data:
        return False
    dest.write_bytes(data)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the script and refresh the theme file."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig("/acrylic", Path(__file__).parent / "frontend", False)]
    )
    add_extra_js_url(hass, JS_URL)
    hass.data[DOMAIN] = JS_URL

    changed = await hass.async_add_executor_job(_sync_theme, _SRC, hass.config.config_dir)
    if changed:
        _LOGGER.info("Updated the Acrylic theme file")
        await hass.services.async_call("frontend", "reload_themes")
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Drop the script registration. Leave the theme file in place."""
    remove_extra_js_url(hass, hass.data.pop(DOMAIN))
    return True
