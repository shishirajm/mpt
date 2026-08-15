const { defineConfig, devices } = require('@playwright/test');

// Dev-only visual regression config. Serves the static site with the exact
// command documented in README.md ("Local preview") — no build step, no
// bundler, matches how the site actually gets served in production.
module.exports = defineConfig({
  testDir: __dirname,
  snapshotDir: __dirname + '/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}-{projectName}{ext}',
  fullyParallel: true,
  reporter: [['html', { outputFolder: __dirname + '/../../playwright-report', open: 'never' }]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  webServer: {
    command: 'python3 -m http.server 8000',
    cwd: __dirname + '/../../src',
    url: 'http://localhost:8000/',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:8000',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
