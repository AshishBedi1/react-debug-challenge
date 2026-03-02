const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 60000,
  webServer: {
    command: 'npm run dev:e2e',
    url: 'http://127.0.0.1:3099',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3099',
  },
});
