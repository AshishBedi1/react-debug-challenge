import { defineConfig, devices } from '@playwright/test'

/**
 * Dedicated port so `npm run test:e2e` does not attach to an unrelated app on 5173.
 * App URL for E2E: set `BASE_URL` (required for documented local runs).
 * `PLAYWRIGHT_BASE_URL` is accepted as an optional alias.
 */
const e2ePort = process.env.PW_E2E_PORT?.trim() || '5174'
const defaultBase = `http://127.0.0.1:${e2ePort}`
const baseURL =
  process.env.BASE_URL?.trim() ||
  process.env.PLAYWRIGHT_BASE_URL?.trim() ||
  defaultBase

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: process.env.PW_SKIP_WEB_SERVER
    ? undefined
    : {
        command: `npm run dev -- --host 127.0.0.1 --port ${e2ePort} --strictPort`,
        url: defaultBase,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
