import { test, expect } from '@playwright/test'

test.describe('Dashboard - Custom Widgets HOC', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 1, email: 'e2e@test.com', name: 'E2E User' },
        }),
      })
    )
  })

  test('Custom Widgets section uses HOC-wrapped components and shows Authorized badge', async ({
    page,
  }) => {
    await page.goto('/dashboard')

    const customWidgets = page.getByTestId('dashboard-custom-widgets')
    await expect(customWidgets).toBeVisible()

    await expect(customWidgets.getByTestId('widget-authorized')).toHaveCount(2)
  })
})
