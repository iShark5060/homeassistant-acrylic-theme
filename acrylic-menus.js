// #menu is painted by a constructed stylesheet inside ha-dropdown.
// A theme cannot cross that shadow, so this module writes the acrylic surface there.
const CSS = `#menu, #submenu {
  background: var(--ha-card-glass-tint) !important;
  background-color: var(--ha-card-glass-tint) !important;
  backdrop-filter: var(--ha-card-backdrop-filter) !important;
  -webkit-backdrop-filter: var(--ha-card-backdrop-filter) !important;
}`;

function paint(el) {
  const root = el.shadowRoot;
  if (!root || root.querySelector("style.acrylic-menu")) return;
  const style = document.createElement("style");
  style.className = "acrylic-menu";
  style.textContent = CSS;
  root.appendChild(style);
}

function patch(tag) {
  customElements.whenDefined(tag).then(() => {
    const proto = customElements.get(tag).prototype;
    if (proto.__acrylicMenu) return;
    proto.__acrylicMenu = true;
    const orig = proto.connectedCallback;
    proto.connectedCallback = function () {
      orig?.call(this);
      const run = () => paint(this);
      if (this.updateComplete?.then) this.updateComplete.then(run);
      else run();
    };
  });
}

patch("ha-dropdown");
patch("ha-dropdown-item");
