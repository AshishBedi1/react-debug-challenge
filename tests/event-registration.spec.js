import { test, expect } from '@playwright/test';

test.describe('Event Registration Form', () => {
  test('should prevent moving to next step if required fields are empty', async ({ page }) => {
    await page.goto('/register');

    // Initially on Step 1 (Personal Information)
    await expect(page.getByText('Personal Information')).toBeVisible();

    // Try to click Next without filling anything
    await page.getByRole('button', { name: 'Next' }).click();

    // Should still be on Step 1 because validation should fail
    await expect(page.getByText('Personal Information')).toBeVisible();
    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should allow moving to next step when fields are valid', async ({ page }) => {
    await page.goto('/register');

    await page.getByPlaceholder('Enter your full name').fill('John Doe');
    await page.getByPlaceholder('your@email.com').fill('john@example.com');

    await page.getByRole('button', { name: 'Next' }).click();

    // Should move to Step 2 (Preferences)
    await expect(page.getByText('Preferences')).toBeVisible();
  });
});
