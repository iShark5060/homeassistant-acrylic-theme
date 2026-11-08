# Acrylic

Home Assistant theme. The glass behavior comes from [Frosted Glass](https://github.com/wessamlauf/homeassistant-frosted-glass-themes) by Wessam Lauf. The paint is the Arsenal Acrylic style: `blur(40px) saturate(200%) contrast(1.08)`, a 55% tint, 8px corners, a 0.5px top highlight, and tiled noise.

`themes/acrylic.yaml` defines two themes.

- Acrylic Dark
- Acrylic Light

## Install with HACS

HACS has to be installed already. The menu script is not part of a theme download. HACS only copies `themes/*.yaml` for a theme, and Home Assistant will not serve that folder to the browser.

Add this repository as an Integration. If it is already added as a Theme, remove that custom repository first, then add the same URL with the category set to Integration. Download it and restart Home Assistant.

Then open Settings, Devices & services, Add integration, and choose Acrylic. That serves the menu script and writes the theme file into `config/themes/`. Remove the Lovelace resource that pointed at `/local/acrylic-menus.js`. It 404s because that file is never installed.

Open your profile and pick Acrylic Dark or Acrylic Light.

`configuration.yaml` needs this if it is not there yet. Restart after adding it. Skip it if another theme already loads.

```yaml
frontend:
  themes: !include_dir_merge_named themes
```

## Card styling

Install one of these, not both.

- [UIX](https://github.com/Lint-Free-Technology/uix)
- [card-mod](https://github.com/thomasloven/lovelace-card-mod)

Load it as a frontend module, using that project's own instructions. A dashboard resource only covers Lovelace, so the sidebar and settings panels stay unstyled. UIX understands the `card-mod-*-yaml` keys in this theme.

## Without HACS

Copy `themes/acrylic.yaml` to `config/themes/acrylic.yaml` on the Home Assistant machine. Copy `custom_components/acrylic` to `config/custom_components/acrylic`, restart, and add the Acrylic integration. Reload themes, then pick the theme in your profile. The `frontend` block above still has to be set.
