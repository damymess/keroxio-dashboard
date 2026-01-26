import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Store Screenshots Generator
 *
 * Génère automatiquement les screenshots pour App Store et Google Play
 * en différentes résolutions mobiles.
 *
 * Exécuter avec: npx playwright test store-screenshots.spec.ts --project=chromium
 */

// Device configurations for store screenshots
const DEVICES = {
  // iOS App Store
  'iphone-6.7': { width: 1290, height: 2796, name: 'iPhone 14 Pro Max (6.7")' },
  'iphone-6.5': { width: 1284, height: 2778, name: 'iPhone 11 Pro Max (6.5")' },
  'ipad-12.9': { width: 2048, height: 2732, name: 'iPad Pro 12.9"' },

  // Google Play Store
  'android-phone': { width: 1080, height: 1920, name: 'Android Phone' },
  'android-tablet-7': { width: 1080, height: 1920, name: 'Android Tablet 7"' },
  'android-tablet-10': { width: 1920, height: 1080, name: 'Android Tablet 10"' },
};

// Screens to capture
const SCREENS = [
  { path: '/', name: '01-dashboard', title: 'Tableau de bord' },
  { path: '/vehicles', name: '02-vehicles', title: 'Liste véhicules' },
  { path: '/pipeline', name: '03-pipeline', title: 'Pipeline CRM' },
  { path: '/clients', name: '04-clients', title: 'Clients' },
  { path: '/factures', name: '05-factures', title: 'Facturation' },
  { path: '/photos', name: '06-photos', title: 'Studio Photo' },
  { path: '/estimation', name: '07-estimation', title: 'Estimation Argus' },
  { path: '/scan', name: '08-scan', title: 'Scan Carte Grise' },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'mobile', 'assets', 'screenshots');

test.describe('Store Screenshots Generator', () => {
  test.beforeAll(async () => {
    // Create output directories
    const platforms = ['ios', 'android'];
    for (const platform of platforms) {
      const dir = path.join(OUTPUT_DIR, platform);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  });

  // Mock authentication for screenshots
  test.beforeEach(async ({ page }) => {
    // Set up mock auth state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock_token_for_screenshots');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'demo@keroxio.fr',
        name: 'Garage Demo',
        role: 'admin'
      }));
    });
  });

  test('Generate iOS Screenshots (iPhone 6.7")', async ({ browser }) => {
    const device = DEVICES['iphone-6.7'];
    const context = await browser.newContext({
      viewport: { width: device.width / 3, height: device.height / 3 }, // Scale down for browser
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    for (const screen of SCREENS) {
      await captureScreen(page, screen, 'ios/iphone-6.7');
    }

    await context.close();
  });

  test('Generate iOS Screenshots (iPhone 6.5")', async ({ browser }) => {
    const device = DEVICES['iphone-6.5'];
    const context = await browser.newContext({
      viewport: { width: device.width / 3, height: device.height / 3 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    for (const screen of SCREENS) {
      await captureScreen(page, screen, 'ios/iphone-6.5');
    }

    await context.close();
  });

  test('Generate Android Screenshots (Phone)', async ({ browser }) => {
    const device = DEVICES['android-phone'];
    const context = await browser.newContext({
      viewport: { width: device.width / 2.5, height: device.height / 2.5 },
      deviceScaleFactor: 2.5,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    for (const screen of SCREENS) {
      await captureScreen(page, screen, 'android/phone');
    }

    await context.close();
  });
});

async function captureScreen(
  page: Page,
  screen: { path: string; name: string; title: string },
  outputSubdir: string
) {
  const outputPath = path.join(OUTPUT_DIR, outputSubdir);

  // Ensure directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  try {
    // Navigate to the screen
    await page.goto(screen.path, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Hide any toast notifications or overlays
    await page.evaluate(() => {
      const toasts = document.querySelectorAll('[data-toast], .toast, .notification');
      toasts.forEach(el => (el as HTMLElement).style.display = 'none');
    });

    // Take screenshot
    const screenshotPath = path.join(outputPath, `${screen.name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
      type: 'png'
    });

    console.log(`✅ Captured: ${screen.title} -> ${screenshotPath}`);
  } catch (error) {
    console.error(`❌ Failed to capture ${screen.title}: ${error}`);
  }
}
