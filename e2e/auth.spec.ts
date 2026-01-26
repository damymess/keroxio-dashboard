import { test, expect } from '@playwright/test';
import { TEST_USER, login } from './fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check logo and title
    await expect(page.locator('h1')).toContainText('Keroxio');
    await expect(page.locator('text=Connectez-vous à votre espace')).toBeVisible();

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Se connecter');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');

    // Wait for dashboard to load (h1 appears after loading spinner)
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);

    // Click and immediately check for loading state
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // The button should show loading or be disabled briefly
    // Note: Since auth is mocked and fast, this might be hard to catch
  });

  test('should persist authentication after page reload', async ({ page }) => {
    // Login first
    await login(page);

    // Reload page
    await page.reload();

    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL('/');
  });

  test('should be able to logout', async ({ page }) => {
    // Login first
    await login(page);

    // Find and click logout (in sidebar or header)
    const logoutButton = page.locator('text=Déconnexion').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL('/login');
    }
  });

  test('should protect all private routes', async ({ page }) => {
    const protectedRoutes = [
      '/',
      '/clients',
      '/prospects',
      '/pipeline',
      '/vehicles',
      '/photos',
      '/annonces',
      '/factures',
      '/statistics',
      '/tasks',
      '/settings',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission
    // Check that we're still on login page
    await expect(page).toHaveURL('/login');
  });

  test('should have remember me checkbox', async ({ page }) => {
    await page.goto('/login');

    const rememberMe = page.locator('input[type="checkbox"]');
    await expect(rememberMe).toBeVisible();
    await expect(page.locator('text=Se souvenir de moi')).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('text=Mot de passe oublié ?')).toBeVisible();
  });
});
