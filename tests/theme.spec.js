import { test, expect } from '@playwright/test';

test('theme toggling works', async ({ page }) => {
  await page.goto('/');
  
  // Initially should be light theme (default)
  const appDiv = page.locator('.app');
  await expect(appDiv).toHaveClass(/light/);
  
  // Find theme toggle button
  const themeToggle = page.locator('.theme-toggle');
  
  // Click to toggle to dark
  await themeToggle.click();
  
  // Should now be dark theme
  await expect(appDiv).toHaveClass(/dark/);
  
  // Click again to toggle back to light
  await themeToggle.click();
  await expect(appDiv).toHaveClass(/light/);
});
