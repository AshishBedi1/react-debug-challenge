import { test, expect } from '@playwright/test';

test.describe('Contact Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.click('button.btn-submit');

    await expect(page.locator('#name-error')).toHaveText('Name is required');
    await expect(page.locator('#email-error')).toHaveText('Email is required');
    await expect(page.locator('#message-error')).toHaveText('Message is required');
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.fill('#contact-name', 'John Doe');
    await page.fill('#contact-email', 'invalid-email');
    await page.fill('#contact-message', 'Hello world');
    await page.click('button.btn-submit');

    await expect(page.locator('#email-error')).toHaveText('Please enter a valid email');
  });

  test('should submit successfully with valid data', async ({ page }) => {
    await page.fill('#contact-name', 'John Doe');
    await page.fill('#contact-email', 'john@example.com');
    await page.fill('#contact-message', 'Hello world');
    
    // We expect a toast success message
    await page.click('button.btn-submit');
    
    await expect(page.locator('.Toastify__toast--success')).toBeVisible();
    await expect(page.locator('.Toastify__toast--success')).toContainText("Message sent! We'll get back to you soon.");
  });
});
