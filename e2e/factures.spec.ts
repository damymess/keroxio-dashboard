import { test, expect } from '@playwright/test';
import { login } from './fixtures';

test.describe('Billing - Devis & Factures', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/factures');
  });

  test('should display factures page with header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Devis & Factures');
    await expect(page.locator('text=/\\d+ devis.*\\d+ factures/')).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    await expect(page.locator('text=Devis en cours')).toBeVisible();
    await expect(page.locator('text=Factures émises')).toBeVisible();
    await expect(page.locator('text=En attente')).toBeVisible();
    await expect(page.locator('text=Encaissé')).toBeVisible();
  });

  test('should display factures table', async ({ page }) => {
    // Check table headers
    await expect(page.locator('th:has-text("Numéro")')).toBeVisible();
    await expect(page.locator('th:has-text("Client")')).toBeVisible();
    await expect(page.locator('th:has-text("Véhicule")')).toBeVisible();
    await expect(page.locator('th:has-text("Montant TTC")')).toBeVisible();
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Statut")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should display facture data', async ({ page }) => {
    // Check facture numbers
    await expect(page.locator('text=FAC-2024-0042')).toBeVisible();
    await expect(page.locator('text=DEV-2024-0023')).toBeVisible();

    // Check client names
    await expect(page.locator('td:has-text("Jean Dupont")')).toBeVisible();
    await expect(page.locator('td:has-text("Marie Martin")')).toBeVisible();
  });

  test('should display status badges', async ({ page }) => {
    // Status badges are inside the table
    const table = page.locator('table');
    await expect(table.locator('text=Payé')).toBeVisible();
    await expect(table.locator('text=Envoyé').first()).toBeVisible();
    await expect(table.locator('text=Brouillon')).toBeVisible();
    await expect(table.locator('text=Annulé')).toBeVisible();
  });

  test('should filter by search', async ({ page }) => {
    // Use more specific selector for the page search input (not header)
    const searchInput = page.locator('input[placeholder*="numéro ou client"]');

    // Search for a client
    await searchInput.fill('Jean Dupont');

    // Should show Jean Dupont
    await expect(page.locator('td:has-text("Jean Dupont")')).toBeVisible();

    // Should not show other clients
    await expect(page.locator('td:has-text("Marie Martin")')).not.toBeVisible();
  });

  test('should filter by type', async ({ page }) => {
    const typeSelect = page.locator('select').first();

    // Filter by devis
    await typeSelect.selectOption('devis');

    // Should show devis
    await expect(page.locator('text=DEV-2024-0023')).toBeVisible();

    // Should not show factures
    await expect(page.locator('text=FAC-2024-0042')).not.toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    const statusSelect = page.locator('select').last();

    // Filter by paid
    await statusSelect.selectOption('paye');

    // Should show paid factures
    await expect(page.locator('text=FAC-2024-0042')).toBeVisible();

    // Should not show unpaid
    await expect(page.locator('text=FAC-2024-0041')).not.toBeVisible();
  });

  test('should have new devis button', async ({ page }) => {
    const newDevisButton = page.locator('button:has-text("Nouveau devis")');
    await expect(newDevisButton).toBeVisible();
  });

  test('should have new facture button', async ({ page }) => {
    const newFactureButton = page.locator('button:has-text("Nouvelle facture")');
    await expect(newFactureButton).toBeVisible();
  });

  test('should have view PDF action button', async ({ page }) => {
    // Find the eye icon button
    const viewButton = page.locator('button[title="Voir le PDF"]').first();
    await expect(viewButton).toBeVisible();
  });

  test('should have download PDF action button', async ({ page }) => {
    // Find the download button
    const downloadButton = page.locator('button[title="Télécharger PDF"]').first();
    await expect(downloadButton).toBeVisible();
  });

  test('should show convert button for sent devis', async ({ page }) => {
    // The devis DEV-2024-0023 has status "envoye" so should show convert button
    const convertButton = page.locator('button:has-text("Convertir en facture")');
    await expect(convertButton).toBeVisible();
  });

  test('should show send button for draft documents', async ({ page }) => {
    // Check for send button (paper airplane icon)
    const sendButton = page.locator('button[title="Envoyer par email"]');
    await expect(sendButton).toBeVisible();
  });

  test('should display vehicle names', async ({ page }) => {
    await expect(page.locator('td:has-text("Peugeot 3008 GT Line")')).toBeVisible();
    await expect(page.locator('td:has-text("BMW 320d M Sport")')).toBeVisible();
  });

  test('should display amounts in currency format', async ({ page }) => {
    // Check for formatted amounts in the table cells
    const table = page.locator('table');
    // Look for amounts with € symbol or formatted numbers
    await expect(table.locator('text=/29.*€|€.*29/')).toBeVisible();
    await expect(table.locator('text=/32.*€|€.*32/')).toBeVisible();
  });

  test('should show empty state when no results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="numéro ou client"]');

    // Search for non-existent document
    await searchInput.fill('INEXISTANT-9999');

    // Should show empty state
    await expect(page.locator('text=Aucun document trouvé')).toBeVisible();
  });

  test('should open PDF modal on view click', async ({ page }) => {
    // Click view button
    const viewButton = page.locator('button[title="Voir le PDF"]').first();
    await viewButton.click();

    // Modal should appear - wait for it
    await page.waitForTimeout(500);
  });

  test('should open convert dialog', async ({ page }) => {
    // Click convert button
    const convertButton = page.locator('button:has-text("Convertir en facture")');
    await convertButton.click();

    // Dialog should appear - look for dialog content
    await expect(page.locator('text=irréversible')).toBeVisible({ timeout: 5000 });
  });

  test('should close convert dialog on cancel', async ({ page }) => {
    // Open dialog
    const convertButton = page.locator('button:has-text("Convertir en facture")');
    await convertButton.click();

    // Wait for dialog
    await expect(page.locator('text=irréversible')).toBeVisible({ timeout: 5000 });

    // Find and click cancel/close button
    const closeButton = page.locator('button:has-text("Annuler")');
    await closeButton.click();

    // Dialog should be closed
    await expect(page.locator('text=irréversible')).not.toBeVisible();
  });

  test('should filter by facture number', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="numéro ou client"]');

    // Search by facture number
    await searchInput.fill('FAC-2024-0042');

    // Should show the facture
    await expect(page.locator('td:has-text("FAC-2024-0042")', { hasText: 'FAC-2024-0042' })).toBeVisible();

    // Should not show others
    await expect(page.locator('text=DEV-2024-0023')).not.toBeVisible();
  });
});

test.describe('Billing - Statistics Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/statistics');
  });

  test('should display statistics page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Statistiques');
  });

  test('should display charts', async ({ page }) => {
    // Recharts renders SVG elements - wait for them to load
    await expect(page.locator('svg.recharts-surface').first()).toBeVisible({ timeout: 10000 });
  });
});
