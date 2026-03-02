import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('Submitting the contact form with required fields empty shows validation error messages', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click()
    const alerts = page.getByRole('alert')
    await expect(alerts).toHaveCount(3)
    await expect(alerts.filter({ hasText: /required|invalid/i })).toHaveCount(3)
  })

  test('Submitting with valid required fields shows success and no validation errors', async ({ page }) => {
    await page.getByLabel(/^name\s*\*/i).fill('Jane')
    await page.getByLabel(/^email\s*\*/i).fill('jane@example.com')
    await page.getByLabel(/^message\s*\*/i).fill('Hello')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/message sent/i)).toBeVisible()
    await expect(page.locator('#name-error, #email-error, #message-error')).toHaveCount(0)
  })

  test('Submitting with invalid email shows email validation error message', async ({ page }) => {
    await page.getByLabel(/^email\s*\*/i).fill('notanemail')
    await page.getByRole('button', { name: /send message/i }).click()
    await expect(page.getByText(/valid email|email.*required/i)).toBeVisible()
  })
})
