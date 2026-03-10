// @ts-check
import { test, expect } from '@playwright/test'

const baseURL = 'http://127.0.0.1:5173'

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user: null }) })
    )
  })

  test('focuses the name input when the contact page loads', async ({ page }) => {
    await page.goto(`${baseURL}/contact`)
    const nameInput = page.getByTestId('contact-name-input')
    await expect(nameInput).toBeVisible()
    await expect(nameInput).toBeFocused()
  })

  test('focuses the name input after clicking Reset', async ({ page }) => {
    await page.goto(`${baseURL}/contact`)
    const nameInput = page.getByTestId('contact-name-input')
    await expect(nameInput).toBeVisible()
    await page.getByTestId('contact-reset-btn').click()
    await expect(nameInput).toBeFocused()
  })
})
