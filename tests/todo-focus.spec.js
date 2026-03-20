import { test, expect } from '@playwright/test';

test.describe('Todo Manager Focus', () => {
  test('should focus the input when "New Task" button is clicked', async ({ page }) => {
    await page.goto('/todos');
    
    const newTaskButton = page.getByRole('button', { name: /New Task/i });
    const todoInput = page.locator('.todo-input');

    // Click the button
    await newTaskButton.click();

    // The input should be focused
    await expect(todoInput).toBeFocused();
  });
});
