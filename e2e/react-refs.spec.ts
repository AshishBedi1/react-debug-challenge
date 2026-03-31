import { test, expect } from '@playwright/test'

const TODOS_PATH = '/todos'

test.beforeEach(async ({ page }) => {
  await page.goto(TODOS_PATH)
  await page.evaluate(() => localStorage.removeItem('todos'))
  await page.reload()
})

test.describe('React refs usage (todos)', () => {
  test('main text input is focused on load when not editing', async ({ page }) => {
    const input = page.getByTestId('todo-input')
    await expect(input).toBeFocused()
  })

  test('focus control button moves focus to the ref-backed input and increments drafts counter', async ({
    page,
  }) => {
    await expect(page.getByTestId('todo-drafts-count')).toHaveText('0')
    await page.getByTestId('todo-focus-new-task-btn').click()
    await expect(page.getByTestId('todo-input')).toBeFocused()
    await expect(page.getByTestId('todo-drafts-count')).toHaveText('1')
  })

  test('progress track exposes measurable layout (ref-style DOM measurement)', async ({ page }) => {
    const track = page.getByTestId('todo-progress-track')
    await expect(track).toBeVisible()
    const box = await track.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.height).toBeGreaterThan(0)
  })

  test('after adding a todo, focus returns to the main input', async ({ page }) => {
    const input = page.getByTestId('todo-input')
    await input.fill('E2E ref focus check')
    await page.getByTestId('todo-submit').click()
    await expect(input).toHaveValue('')
    await expect(input).toBeFocused()
  })

  test('edit field receives focus when entering edit mode', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Editable item')
    await page.getByTestId('todo-submit').click()
    await page.getByTestId('todo-item-edit-btn').click()
    await expect(page.getByTestId('todo-edit-input')).toBeFocused()
  })

  test('new todo appears in the list container', async ({ page }) => {
    await page.getByTestId('todo-input').fill('Listed task')
    await page.getByTestId('todo-submit').click()
    const list = page.getByTestId('todo-list')
    await expect(list.getByTestId('todo-item')).toHaveCount(1)
    await expect(list.getByTestId('todo-item').first()).toContainText('Listed task')
  })
})
