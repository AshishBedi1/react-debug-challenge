import { defineConfig } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    headless: true,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
