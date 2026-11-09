// #menu is painted by a constructed stylesheet inside the dropdown shadow.
// Hook shadow creation so the rule lands even if the element already exists.
const CSS = `#menu, #submenu, [part="popup"], [part="body"] {
  background: var(--ha-card-glass-tint) !important;
  background-color: var(--ha-card-glass-tint) !important;
  backdrop-filter: var(--ha-card-backdrop-filter) !important;
  -webkit-backdrop-filter: var(--ha-card-backdrop-filter) !important;
}`;

const TAGS = new Set([
  "ha-dropdown",
  "ha-dropdown-item",
  "wa-dropdown",
  "wa-popup",
]);

function paint(el) {
  const root = el.shadowRoot;
  if (!root || root.querySelector("style.acrylic-menu")) return;
  const style = document.createElement("style");
  style.className = "acrylic-menu";
  style.textContent = CSS;
  root.appendChild(style);
}

function walk(node) {
  if (!node?.querySelectorAll) return;
  for (const el of node.querySelectorAll("*")) {
    if (TAGS.has(el.localName)) paint(el);
    if (PANEL_CARDS.has(el.localName) && insidePanel(el)) clearPanelGlass(el);
    if (el.shadowRoot) walk(el.shadowRoot);
  }
}

const origAttach = Element.prototype.attachShadow;
Element.prototype.attachShadow = function (init) {
  const root = origAttach.call(this, init);
  if (TAGS.has(this.localName)) {
    const style = document.createElement("style");
    style.className = "acrylic-menu";
    style.textContent = CSS;
    root.appendChild(style);
  }
  if (
    PANEL_CARDS.has(this.localName) ||
    this.localName === "ha-card" ||
    this.localName === "hui-panel-view"
  ) {
    schedule();
  }
  return root;
};

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    scan();
  });
}

const PANEL_CARDS = new Set([
  "hui-picture-elements-card",
  "hui-picture-card",
  "hui-picture-glance-card",
  "hui-map-card",
  "hui-iframe-card",
]);

function hostOf(node) {
  const root = node.getRootNode?.();
  return root && root.host ? root.host : null;
}

function insidePanel(el) {
  let n = el;
  const seen = new Set();
  while (n && !seen.has(n)) {
    seen.add(n);
    if (n.localName === "hui-panel-view") return true;
    n = n.parentElement || hostOf(n);
  }
  return false;
}

// ha-card's own :host rule reads these variables. A parent stylesheet
// cannot outrank that rule, so the panel card has to clear them itself.
function clearPanelGlass(card) {
  const ha = card.shadowRoot?.querySelector("ha-card");
  if (!ha) return;
  ha.style.setProperty("--ha-card-backdrop-filter", "none");
  ha.style.setProperty("--ha-card-background", "transparent");
  ha.style.setProperty("--ha-card-glass-tint", "transparent");
  ha.style.setProperty("--frosted-glass-card-layer-content", "none");
  ha.style.setProperty("backdrop-filter", "none", "important");
  ha.style.setProperty("-webkit-backdrop-filter", "none", "important");
  ha.style.setProperty("background", "none", "important");
}

function scan() {
  walk(document);
}

scan();
window.addEventListener("location-changed", schedule);
document.addEventListener("show-dialog", () => {
  requestAnimationFrame(scan);
  setTimeout(scan, 250);
  setTimeout(scan, 1000);
}, true);
