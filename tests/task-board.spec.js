import { test, expect } from '@playwright/test';

test('Task Board: can move task from To Do to In Progress', async ({ page }) => {
  await page.goto('/task-board');

  // Wait for the Task Board to load
  await expect(page.locator('h1')).toHaveText('Task Board');

  // Find the first task in "To Do" column
  const todoColumn = page.locator('.board-column', { hasText: 'To Do' });
  const firstTask = todoColumn.locator('.task-card').first();
  const taskTitle = await firstTask.locator('.task-title').textContent();

  // Click "Move" on the first task
  await firstTask.getByRole('button', { name: 'Move' }).click();

  // Verify it's now in "In Progress" column
  const inProgressColumn = page.locator('.board-column', { hasText: 'In Progress' });
  await expect(inProgressColumn.locator('.task-card', { hasText: taskTitle })).toBeVisible();

  // Verify it's no longer in "To Do" column
  await expect(todoColumn.locator('.task-card', { hasText: taskTitle })).not.toBeVisible();
});
