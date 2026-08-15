const { defineConfig } = require('@playwright/test');

// Dev-only broken-link check. Serves the static site the same way
// tests/visual does — no build step, matches production serving.
module.exports = defineConfig({
  testDir: __dirname,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  webServer: {
    command: 'python3 -m http.server 8010',
    cwd: __dirname + '/../../src',
    url: 'http://localhost:8010/',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:8010',
  },
  projects: [{ name: 'links' }],
});
