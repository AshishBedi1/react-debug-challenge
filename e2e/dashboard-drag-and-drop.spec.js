import { test, expect } from '@playwright/test'

const mockUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]
const mockPosts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  body: `Body of post ${i + 1}`,
  userId: 1,
}))

test.describe('Dashboard sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/jsonplaceholder.typicode.com/users', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUsers) })
    )
    await page.route('**/jsonplaceholder.typicode.com/posts*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPosts) })
    )
    const base = (process.env.BASE_URL || '/').replace(/\/$/, '')
    await page.goto(`${base}/dashboard`)
    await page.waitForSelector('.dashboard-sections', { timeout: 15000 })
  })

  test('dashboard loads and shows four sections', async ({ page }) => {
    const sections = page.locator('.draggable-section')
    await expect(sections).toHaveCount(4)
  })

  test('section titles are present in initial order', async ({ page }) => {
    const titles = page.locator('.draggable-section .section-title')
    await expect(titles).toHaveCount(4)
    await expect(titles.nth(0)).toHaveText('Key Metrics')
    await expect(titles.nth(1)).toHaveText('Analytics')
    await expect(titles.nth(2)).toHaveText('Recent Activity')
    await expect(titles.nth(3)).toHaveText('Custom Widgets')
  })
})
