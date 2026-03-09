import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test('focuses first invalid field (name) when submit with empty name', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByTestId('contact-form')).toBeVisible()
    await page.getByTestId('contact-submit-btn').click()
    await expect(page.getByTestId('contact-name-input')).toBeFocused()
  })
})
