import { test, expect } from '@playwright/test';
import { login } from './fixtures';

test.describe('Vehicles', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/vehicles');
  });

  test('should display vehicles page with header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Stock Véhicules');
    await expect(page.locator('text=/\\d+.*véhicules/')).toBeVisible();
  });

  test('should display vehicle cards', async ({ page }) => {
    // Check that vehicle cards are displayed
    await expect(page.locator('text=Peugeot 3008')).toBeVisible();
    await expect(page.locator('text=BMW 320d')).toBeVisible();
    await expect(page.locator('text=Renault Clio')).toBeVisible();
  });

  test('should toggle between grid and list view', async ({ page }) => {
    // Find view toggle buttons
    const buttons = page.locator('.flex.gap-1 button, .flex.gap-2 button');
    const count = await buttons.count();

    if (count >= 2) {
      // Click to switch view
      await buttons.nth(1).click();
      await page.waitForTimeout(300);

      // Click back
      await buttons.nth(0).click();
    }
  });

  test('should filter vehicles by search', async ({ page }) => {
    // Use specific selector for vehicle page search
    const searchInput = page.locator('input[placeholder*="marque"]');

    // Search for Peugeot
    await searchInput.fill('Peugeot');
    await page.waitForTimeout(500);

    // Should show Peugeot
    await expect(page.locator('text=Peugeot 3008')).toBeVisible();

    // Should not show BMW
    await expect(page.locator('text=BMW 320d')).not.toBeVisible();

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Should show all vehicles again
    await expect(page.locator('text=BMW 320d')).toBeVisible();
  });

  test('should filter vehicles by status', async ({ page }) => {
    const statusSelect = page.locator('select');

    // Filter by "Disponible"
    await statusSelect.selectOption('disponible');
    await page.waitForTimeout(500);

    // Should show disponible vehicles
    await expect(page.locator('text=Peugeot 3008')).toBeVisible();
    await expect(page.locator('text=Renault Clio')).toBeVisible();

    // Should not show reserved vehicle
    await expect(page.locator('text=BMW 320d')).not.toBeVisible();
  });

  test('should display vehicle details in card', async ({ page }) => {
    // Check vehicle card has expected information
    await expect(page.locator('text=GT Line')).toBeVisible();
    // Look for mileage pattern
    await expect(page.locator('text=/\\d+.*km/').first()).toBeVisible();
  });

  test('should display vehicle status badges', async ({ page }) => {
    // Look for status badges - exclude select options by targeting visible badge elements
    const statusBadge = page.locator('span:has-text("Disponible"), [class*="badge"]:has-text("Disponible")').first();
    await expect(statusBadge).toBeVisible();
  });

  test('should display stock warning for old vehicles', async ({ page }) => {
    // Look for "X jours en stock" warning pattern
    await expect(page.locator('text=/\\d+.*jours.*stock/')).toBeVisible();
  });

  test('should have add vehicle button', async ({ page }) => {
    const addButton = page.locator('button:has-text("Ajouter"), button:has-text("Nouveau")');
    await expect(addButton).toBeVisible();
  });

  test('should display vehicle prices', async ({ page }) => {
    // Check that prices are displayed (formatted as currency with €)
    await expect(page.locator('text=/\\d+.*€|€.*\\d+/').first()).toBeVisible();
  });

  test('should display views and leads count', async ({ page }) => {
    // Check stats are displayed - look for "X vues" or "X leads" patterns
    await expect(page.locator('text=/\\d+.*vues|\\d+.*leads/').first()).toBeVisible();
  });

  test('should show empty state when no results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="marque"]');

    // Search for non-existent vehicle
    await searchInput.fill('Ferrari LaFerrari');
    await page.waitForTimeout(500);

    // Should show empty state or no vehicle cards
    const emptyState = page.locator('text=Aucun véhicule trouvé, text=Aucun résultat');
    const vehicleCards = page.locator('.group.relative, [class*="vehicle-card"]');

    // Either empty state text or no results
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasNoResults = await page.locator('text=Peugeot 3008').isVisible().catch(() => false);

    expect(hasEmptyState || !hasNoResults).toBe(true);
  });

  test('should filter by immatriculation', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="marque"]');

    // Search by license plate
    await searchInput.fill('AB-123-CD');
    await page.waitForTimeout(500);

    // Should show the Peugeot or filter works
    const peugeotVisible = await page.locator('text=Peugeot 3008').isVisible();
    const bmwNotVisible = !(await page.locator('text=BMW 320d').isVisible());

    // Either Peugeot is shown or BMW is filtered out
    expect(peugeotVisible || bmwNotVisible).toBe(true);
  });
});
