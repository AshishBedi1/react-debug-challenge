import { test, expect } from '@playwright/test'

test.describe('Cart page', () => {
  test('Cart page shows the cart content', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('.cart-content')).toBeVisible()
    await expect(page.locator('.cart-header')).toBeVisible()
  })

  test('Cart page shows empty state or cart UI', async ({ page }) => {
    await page.goto('/cart')
    const emptyOrContent = page.locator('.empty-cart, .cart-items-list, .cart-summary-section')
    await expect(emptyOrContent.first()).toBeVisible()
  })

  test('Cart page loads without error', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('.shopping-cart')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })
})
