import { test, expect } from '@playwright/test'

test.describe('Task Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/task-board')
    await page.waitForSelector('.task-board', { timeout: 15000 })
  })

  test('Task Board columns show headers and task counts', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'In Progress' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible()
    const columnCounts = page.locator('.column-count')
    await expect(columnCounts).toHaveCount(3)
    const counts = await columnCounts.allTextContents()
    const hasNonZero = counts.some((c) => c.trim() !== '0')
    expect(hasNonZero).toBeTruthy()
  })

  test('Task Board shows task cards in columns', async ({ page }) => {
    const columns = page.locator('.board-column')
    await expect(columns).toHaveCount(3)
    const columnBodies = page.locator('.column-body')
    await expect(columnBodies).toHaveCount(3)
    const taskCards = page.locator('.task-card')
    await expect(taskCards.first()).toBeVisible({ timeout: 5000 })
  })

  test('Task move button advances task to next column', async ({ page }) => {
    const todoColumn = page.locator('.board-column').first()
    const firstTaskInTodo = todoColumn.locator('.task-card').first()
    await expect(firstTaskInTodo).toBeVisible({ timeout: 5000 })
    const taskTitle = await firstTaskInTodo.locator('.task-title').textContent()
    const moveBtn = firstTaskInTodo.getByRole('button', { name: 'Move' })
    await moveBtn.click()
    const inProgressColumn = page.locator('.board-column').nth(1)
    await expect(inProgressColumn.locator('.task-title', { hasText: taskTitle })).toBeVisible({ timeout: 5000 })
  })
})
