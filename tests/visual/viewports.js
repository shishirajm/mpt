// Responsive states from CLAUDE.md §7 — one source of truth so every
// page/spec gets tested at all of them automatically.
module.exports = [
  { name: 'mobile-320', width: 320, height: 700 },   // must-not-break floor
  { name: 'mobile-390', width: 390, height: 844 },   // designed-at
  { name: 'tablet-768-portrait', width: 768, height: 1024 },   // designed-at
  { name: 'tablet-1024-landscape', width: 1024, height: 768 },   // designed-at
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },   // designed-at
  { name: 'desktop-1920', width: 1920, height: 1080 },
];
