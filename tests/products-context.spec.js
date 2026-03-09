// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Products page and Context', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: null, isAuthenticated: false }),
      })
    )
    await page.goto('/')
  })

  test('Products page renders with context (currency and locale)', async ({ page }) => {
    await page.locator('a[href="/products"]').first().click()
    await expect(page.getByTestId('products-page')).toBeVisible()
    await expect(page.getByText(/Theme:.*·.*·/)).toBeVisible()
  })
})
