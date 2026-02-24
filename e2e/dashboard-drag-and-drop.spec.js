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

const dragOptions = {
  sourcePosition: { x: 8, y: 8 },
  targetPosition: { x: 8, y: 8 },
}

async function dragSectionWithFallback(sectionTitles, source, target) {
  await source.dragTo(target, dragOptions)

  const orderAfterNativeDrag = await sectionTitles.allTextContents()
  if (orderAfterNativeDrag[0] === 'Key Metrics') {
    // Some headless runs don't emit full native drag events; use app's pointer fallback.
    await source.dispatchEvent('mousedown', { button: 0 })
    await target.dispatchEvent('mouseup', { button: 0 })
  }
}

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

    await dragSectionWithFallback(sectionTitles, source, target)

    await expect
      .poll(async () => (await sectionTitles.allTextContents()).indexOf('Key Metrics'), {
        timeout: 10000,
      })
      .toBe(2)

    const newOrder = await sectionTitles.allTextContents()

    expect(newOrder).not.toEqual(initialOrder)
    expect(newOrder[0]).not.toBe('Key Metrics')
  })

  test('should move "Key Metrics" after "Recent Activity" when dragged there', async ({ page }) => {
    const sectionTitles = page.locator('.draggable-section .section-title')
    await expect(sectionTitles).toHaveCount(4)

    const source = page.locator('.draggable-section').nth(0)
    const target = page.locator('.draggable-section').nth(2)

    await dragSectionWithFallback(sectionTitles, source, target)

    await expect
      .poll(async () => (await sectionTitles.allTextContents())[2], {
        timeout: 10000,
      })
      .toBe('Key Metrics')

    const updatedOrder = await sectionTitles.allTextContents()

    expect(updatedOrder.indexOf('Key Metrics')).toBeGreaterThan(0)
    expect(updatedOrder[2]).toBe('Key Metrics')
  })

})
