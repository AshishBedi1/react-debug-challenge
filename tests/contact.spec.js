import { test, expect } from '@playwright/test';

const CONTACT_PATH = '/contact';

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CONTACT_PATH);
    await page.locator('#contact-name').waitFor({ state: 'visible', timeout: 15000 });
  });

  test('contact form submission shows success when required fields are filled', async ({ page }) => {
    await page.locator('#contact-name').fill('Jane Doe');
    await page.locator('#contact-email').fill('jane@example.com');
    await page.locator('#contact-message').fill('Hello, this is a test message.');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/message sent|sent!|success/i)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#contact-name')).toHaveValue('');
    await expect(page.locator('#contact-message')).toHaveValue('');
  });

  test('contact form shows validation errors when required fields are empty', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/required/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('contact form does not show success when only partial required fields filled', async ({ page }) => {
    await page.locator('#contact-name').fill('Jane');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/message sent|sent!|success/i)).not.toBeVisible();
  });
});
