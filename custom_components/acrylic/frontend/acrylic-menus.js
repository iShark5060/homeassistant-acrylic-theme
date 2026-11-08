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
  return root;
};

function scan() {
  walk(document);
}

scan();
document.addEventListener("show-dialog", () => {
  requestAnimationFrame(scan);
  setTimeout(scan, 250);
  setTimeout(scan, 1000);
}, true);
