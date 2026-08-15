const { test, expect } = require('@playwright/test');
const viewports = require('./viewports');

// Every live page (CLAUDE.md §11) × every designed responsive state (§7).
const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact.html' },
  { name: '404', path: '/404.html' },
];

for (const page of pages) {
  for (const viewport of viewports) {
    test(`${page.name} @ ${viewport.name}`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
      await browserPage.goto(page.path);
      await expect(browserPage).toHaveScreenshot(`${page.name}-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
