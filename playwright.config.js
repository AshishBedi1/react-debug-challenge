import { defineConfig } from '@playwright/test'

const E2E_PORT = process.env.E2E_PORT || '4173'
const LOCAL_BASE_URL = `http://127.0.0.1:${E2E_PORT}`
const EXTERNAL_BASE_URL = process.env.BASE_URL?.trim()
const USE_EXTERNAL_BASE_URL = Boolean(EXTERNAL_BASE_URL)
const BASE_URL = (USE_EXTERNAL_BASE_URL ? EXTERNAL_BASE_URL : LOCAL_BASE_URL).replace(/\/?$/, '/')

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    headless: true,
    navigationTimeout: 30000,
  },
  // Local mode: no BASE_URL set, Playwright starts the app server.
  // External runner mode: BASE_URL set, Playwright skips webServer and targets existing app URL.
  webServer: USE_EXTERNAL_BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --host 127.0.0.1 --port ${E2E_PORT} --strictPort`,
        url: LOCAL_BASE_URL,
        reuseExistingServer: true,
        timeout: 120000,
      },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
