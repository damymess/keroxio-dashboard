import { test, expect } from '@playwright/test';
import { login } from './fixtures';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display sidebar navigation', async ({ page }) => {
    // Check that main navigation items are visible in sidebar (nav element)
    const sidebar = page.locator('aside');
    await expect(sidebar.locator('a:has-text("Tableau de bord")')).toBeVisible();
    await expect(sidebar.locator('a:has-text("Véhicules")')).toBeVisible();
    await expect(sidebar.locator('a:has-text("Photos")')).toBeVisible();
    await expect(sidebar.locator('a:has-text("Annonces")')).toBeVisible();
    await expect(sidebar.locator('a:has-text("Clients")')).toBeVisible();
    await expect(sidebar.locator('a:has-text("Pipeline")')).toBeVisible();
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Tableau de bord")').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to vehicles', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Véhicules")').click();
    await expect(page).toHaveURL('/vehicles');
    await expect(page.locator('h1')).toContainText('Stock Véhicules');
  });

  test('should navigate to photos', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Photos")').click();
    await expect(page).toHaveURL('/photos');
    await expect(page.locator('h1')).toContainText('Galerie Photos');
  });

  test('should navigate to annonces', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Annonces")').click();
    await expect(page).toHaveURL('/annonces');
  });

  test('should navigate to clients', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Clients")').click();
    await expect(page).toHaveURL('/clients');
  });

  test('should navigate to prospects', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Prospects")').click();
    await expect(page).toHaveURL('/prospects');
  });

  test('should navigate to pipeline', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Pipeline")').click();
    await expect(page).toHaveURL('/pipeline');
    await expect(page.locator('h1')).toContainText('Pipeline');
  });

  test('should navigate to factures', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Factures")').click();
    await expect(page).toHaveURL('/factures');
    await expect(page.locator('h1')).toContainText('Devis & Factures');
  });

  test('should navigate to statistics', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Statistiques")').click();
    await expect(page).toHaveURL('/statistics');
  });

  test('should navigate to tasks', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Tâches")').click();
    await expect(page).toHaveURL('/tasks');
  });

  test('should navigate to settings', async ({ page }) => {
    await page.locator('aside').locator('a:has-text("Paramètres")').click();
    await expect(page).toHaveURL('/settings');
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/');
  });

  test('should display dashboard page', async ({ page }) => {
    // Wait for loading to complete and h1 to appear
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });
  });

  test('should display KPI cards', async ({ page }) => {
    // Wait for loading spinner to disappear
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });
    // Dashboard should have stats cards
    await expect(page.locator('text=Nouveaux Leads')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Wait for page to load first
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Dashboard h1 should still be visible
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible();

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    // Wait for dashboard to load
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });

    // Should have h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login');

    // Login form should have accessible inputs
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    // Wait for dashboard to load
    await expect(page.locator('h1:has-text("Tableau de bord")')).toBeVisible({ timeout: 10000 });

    // Press Tab to navigate
    await page.keyboard.press('Tab');

    // An element should be focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
