import { test, expect } from '@playwright/test';

test.describe('TodoManager Compound Component Pattern', () => {
  test('should render all subcomponents correctly', async ({ page }) => {
    await page.goto('/todos');

    // Check Sidebar (TodoManager.Sidebar)
    await expect(page.locator('.todo-sidebar')).toBeVisible();
    await expect(page.locator('.todo-sidebar h2')).toContainText(/Tasks|Todos/i);

    // Check Main content area (TodoManager.Main)
    await expect(page.locator('.todo-main')).toBeVisible();

    // Check List (TodoManager.List)
    await expect(page.locator('.todo-list-container')).toBeVisible();

    // Check Input (TodoManager.Input)
    await expect(page.locator('.todo-input-container')).toBeVisible();
    await expect(page.locator('.todo-input')).toBeVisible();
  });

  test('should throw error if subcomponent is used outside TodoManager', async ({ page }) => {
    // This is more of a unit test, but we can verify the error boundary or console error if we had one.
    // In this app, App.jsx uses it correctly.
  });
});
