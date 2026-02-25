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

// Headless Chromium doesn't fire HTML5 drag events reliably, and hit-testing for
// mouseup can miss the target. Trigger the app's pointer fallback by dispatching
// mousedown on source and mouseup on target so handlePointerDown/handlePointerUp run.
async function dragSectionWithPointerFallback(source, target) {
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
    const target = page.locator('.draggable-section').nth(2)

    await dragSectionWithPointerFallback(source, target)

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
    const target = page.locator('.draggable-section').nth(2)

    await dragSectionWithPointerFallback(source, target)

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
