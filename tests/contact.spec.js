// @ts-check
import { test, expect } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:5173'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    // Stub auth so any auth-dependent UI behaves; contact page is public but stub keeps flow stable
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user: null }) })
    )
    await page.goto(`${baseURL}/contact`)
  })

  test('contact form loads and is visible', async ({ page }) => {
    await expect(page.getByTestId('contact-form')).toBeVisible()
  })
})
