import { test as base, expect } from '@playwright/test';

// Test user credentials
export const TEST_USER = {
  email: 'test@keroxio.fr',
  password: 'testpassword123',
};

// Extended test with authentication
export const test = base.extend<{ authenticatedPage: typeof base }>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login and authenticate
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('/');

    await use(base);
  },
});

// Helper to login
export async function login(page: any) {
  await page.goto('/login');
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

// Helper to logout
export async function logout(page: any) {
  // Click on user menu or logout button
  await page.click('[data-testid="logout-button"], button:has-text("Déconnexion")');
  await page.waitForURL('/login');
}

export { expect };
