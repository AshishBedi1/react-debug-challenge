import { defineConfig } from '@playwright/test'

const E2E_PORT = process.env.E2E_PORT || '4173'
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${E2E_PORT}`

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
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${E2E_PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
