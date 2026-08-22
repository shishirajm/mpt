const { test, expect } = require('@playwright/test');
const viewports = require('./viewports');

// Every live page (CLAUDE.md §11) × every designed responsive state (§7).
const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact.html' },
  { name: 'engineering', path: '/engineering.html' },
  { name: 'products-index', path: '/products/' },
  { name: 'products-pcd', path: '/products/pcd-tools.html' },
  { name: 'products-fine-boring', path: '/products/fine-boring-tools.html' },
  { name: 'products-iso', path: '/products/iso-tools.html' },
  { name: 'products-blades-inserts', path: '/products/special-blades-inserts.html' },
  { name: 'products-adaptors', path: '/products/adaptors.html' },
  { name: 'products-setting-devices', path: '/products/tool-setting-devices.html' },
  { name: 'products-gallery', path: '/products/gallery.html' },
  { name: 'sectors', path: '/sectors.html' },
  { name: '404', path: '/404.html' },
];

for (const page of pages) {
  for (const viewport of viewports) {
    test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await browserPage.goto(page.path, { waitUntil: 'networkidle' });
      await browserPage.evaluate(() => document.fonts.ready);
      // Scroll-reveal (.reveal, see js/app.js) only reveals content on real
      // intersection — a fullPage screenshot doesn't scroll far enough on
      // its own to trigger it, so walk the page first, same as a reader would.
      await browserPage.evaluate(async () => {
        const step = Math.max(window.innerHeight, 200);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => requestAnimationFrame(r));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => requestAnimationFrame(r));
      });
      await expect(browserPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
