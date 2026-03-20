const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests',
  baseURL: 'http://127.0.0.1:5173',
  use: { baseURL: 'http://127.0.0.1:5173' },
  webServer: {
    command: 'npm run dev:e2e',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
