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

/**
 * Trigger reorder by firing the app's pointer fallback (handlePointerDown on source,
 * handlePointerUp on target). In headless Chromium the real mouse sequence often
 * does not trigger drag/drop or hit the right element; dispatching on the exact
 * section elements makes the reorder reliable.
 */
async function dragSectionToTarget(page, source, target) {
  await source.scrollIntoViewIfNeeded()
  await target.scrollIntoViewIfNeeded()
  await source.dispatchEvent('mousedown', { button: 0, bubbles: true })
  await target.dispatchEvent('mouseup', { button: 0, bubbles: true })
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
    await expect(sectionTitles.first()).toHaveText('Key Metrics', { timeout: 5000 })

    const initialOrder = await sectionTitles.allTextContents()
    expect(initialOrder).toEqual([
      'Key Metrics',
      'Analytics',
      'Recent Activity',
      'Custom Widgets',
    ])

    const source = page.locator('.draggable-section').nth(0)
    const target = page.locator('.draggable-section').filter({ hasText: 'Recent Activity' })

    await dragSectionToTarget(page, source, target)

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
    await expect(sectionTitles.first()).toHaveText('Key Metrics', { timeout: 5000 })

    const source = page.locator('.draggable-section').nth(0)
    const target = page.locator('.draggable-section').filter({ hasText: 'Recent Activity' })

    await dragSectionToTarget(page, source, target)

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
