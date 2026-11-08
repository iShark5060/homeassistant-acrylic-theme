# Acrylic

Home Assistant theme. The glass behavior comes from [Frosted Glass](https://github.com/wessamlauf/homeassistant-frosted-glass-themes) by Wessam Lauf. The paint is the Arsenal Acrylic style: `blur(40px) saturate(200%) contrast(1.08)`, a 55% tint, 8px corners, a 0.5px top highlight, and tiled noise.

`themes/acrylic.yaml` defines two themes.

- Acrylic Dark
- Acrylic Light

## Install with HACS

HACS has to be installed already. In HACS, open the three-dot menu and choose Custom repositories. Paste this repository's URL, set the category to Theme, and add it. Download Acrylic, then restart Home Assistant.

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

Select menus such as Background size draw their panel inside `ha-dropdown`. That panel's background comes from the component's own stylesheet, so the theme variables never reach it. Copy `acrylic-menus.js` to `config/www/acrylic-menus.js` and add it next to your other frontend module:

```yaml
frontend:
  extra_module_url:
    - /local/acrylic-menus.js
```

Restart Home Assistant after adding that line, then refresh the browser.

## Without HACS

Copy `themes/acrylic.yaml` to `config/themes/acrylic.yaml` on the Home Assistant machine. Reload themes, then pick the theme in your profile. The `frontend` block above still has to be set.
