const { test, expect } = require('@playwright/test');
const viewports = require('./viewports');

// Every live page (CLAUDE.md §11) × every designed responsive state (§7).
const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact.html' },
  { name: 'company', path: '/company.html' },
  { name: 'engineering', path: '/engineering.html' },
  { name: 'tools-index', path: '/tools/' },
  { name: 'tools-pcd', path: '/tools/pcd-tools.html' },
  { name: 'tools-fine-boring', path: '/tools/fine-boring-tools.html' },
  { name: 'tools-iso', path: '/tools/iso-tools.html' },
  { name: 'tools-adaptors', path: '/tools/adaptors.html' },
  { name: 'tools-setting-devices', path: '/tools/tool-setting-devices.html' },
  { name: 'sectors', path: '/sectors.html' },
  { name: '404', path: '/404.html' },
];

for (const page of pages) {
  for (const viewport of viewports) {
    test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await browserPage.goto(page.path, { waitUntil: 'networkidle' });
      await browserPage.evaluate(() => document.fonts.ready);
      await expect(browserPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
