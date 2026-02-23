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

test.describe('Dashboard section drag-and-drop reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/jsonplaceholder.typicode.com/users', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUsers) })
    )
    await page.route('**/jsonplaceholder.typicode.com/posts*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPosts) })
    )

    await page.goto('/dashboard')
    await page.waitForSelector('.dashboard-sections', { timeout: 15000 })
  })

  test('should reorder sections when dragging a section to a new position', async ({ page }) => {
    const sectionTitles = page.locator('.draggable-section .section-title')
    await expect(sectionTitles).toHaveCount(4)

    const initialOrder = await sectionTitles.allTextContents()
    expect(initialOrder).toEqual([
      'Key Metrics',
      'Analytics',
      'Recent Activity',
      'Custom Widgets',
    ])

    const source = page.locator('.draggable-section').nth(0)
    const target = page.locator('.draggable-section').nth(2)

    await source.dragTo(target)

    const newOrder = await sectionTitles.allTextContents()
    expect(newOrder).not.toEqual(initialOrder)
    expect(newOrder[0]).not.toBe('Key Metrics')
  })

  test('should move "Key Metrics" after "Recent Activity" when dragged there', async ({ page }) => {
    const sectionTitles = page.locator('.draggable-section .section-title')
    await expect(sectionTitles).toHaveCount(4)

    const source = page.locator('.draggable-section').nth(0)
    const target = page.locator('.draggable-section').nth(2)

    await source.dragTo(target)

    const updatedOrder = await sectionTitles.allTextContents()

    expect(updatedOrder.indexOf('Key Metrics')).toBeGreaterThan(0)
    expect(updatedOrder[0]).toBe('Analytics')
  })

  test('should persist new order after multiple drag operations', async ({ page }) => {
    const sectionTitles = page.locator('.draggable-section .section-title')
    await expect(sectionTitles).toHaveCount(4)

    const firstSource = page.locator('.draggable-section').nth(3)
    const firstTarget = page.locator('.draggable-section').nth(0)
    await firstSource.dragTo(firstTarget)

    const afterFirstDrag = await sectionTitles.allTextContents()
    expect(afterFirstDrag[0]).toBe('Custom Widgets')

    const secondSource = page.locator('.draggable-section').nth(2)
    const secondTarget = page.locator('.draggable-section').nth(1)
    await secondSource.dragTo(secondTarget)

    const afterSecondDrag = await sectionTitles.allTextContents()
    expect(afterSecondDrag[0]).toBe('Custom Widgets')
    expect(afterSecondDrag).not.toEqual(afterFirstDrag)
  })
})
