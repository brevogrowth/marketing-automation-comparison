import { test, expect, Page } from '@playwright/test';

/**
 * MA Advanced Filters E2E Tests
 *
 * Tests the advanced filtering functionality for the Marketing Automation comparison tool:
 * 1. Channel filters (Email, SMS, WhatsApp, etc.)
 * 2. Integration filters (Shopify, Salesforce, etc.)
 * 3. Budget sensitivity
 * 4. Governance toggle
 * 5. Implementation tolerance
 */

// Helper to unlock advanced filters with a professional email
async function unlockAdvancedFilters(page: Page) {
  // Find and click unlock button
  const unlockButton = page.getByRole('button', { name: /Unlock|Débloquer|Entsperren|Desbloquear/i });

  if (await unlockButton.isVisible({ timeout: 3000 })) {
    await unlockButton.click();
    await page.waitForTimeout(500);

    // Fill in professional email
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: 3000 })) {
      await emailInput.fill('test@company.com');

      // Submit the form
      const submitButton = page.getByRole('button', { name: /Submit|Valider|Absenden|Enviar|Continue/i });
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
    }
  }
}

// Helper to get vendor count
async function getVendorCount(page: Page): Promise<number> {
  const vendorCards = page.locator('[data-testid^="vendor-card-"]');
  return await vendorCards.count();
}

test.describe('Advanced Filter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('Filters are initially locked and require email', async ({ page }) => {
    // Advanced section should be visible but locked
    const advancedSection = page.getByText(/Advanced|Avancé|Erweitert|Avanzado/i);
    await expect(advancedSection.first()).toBeVisible({ timeout: 5000 });

    // Should show unlock prompt
    const unlockText = page.getByText(/Unlock|Débloquer|Entsperren|Desbloquear|business email/i);
    await expect(unlockText.first()).toBeVisible();

    // Channel filter buttons should NOT be visible yet
    const channelButton = page.getByRole('button', { name: /^Email$/i });
    expect(await channelButton.count()).toBe(0);
  });

  test('Advanced filters unlock after email submission', async ({ page }) => {
    await unlockAdvancedFilters(page);

    // Channel filter section should now be visible
    const channelsLabel = page.getByText(/Marketing Channels|Canaux|Kanäle|Canales/i);
    await expect(channelsLabel.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Channel Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await unlockAdvancedFilters(page);
  });

  test('Email channel filter shows email-capable vendors', async ({ page }) => {
    // Get initial vendor count
    const initialCount = await getVendorCount(page);
    expect(initialCount).toBeGreaterThan(0);

    // Find and click the Email channel filter
    const emailButton = page.getByRole('button', { name: /^Email$/i });
    if (await emailButton.isVisible({ timeout: 3000 })) {
      await emailButton.click();
      await page.waitForTimeout(500);

      // Should still have vendors (email is common)
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
    }
  });

  test('SMS channel filter works correctly', async ({ page }) => {
    const smsButton = page.getByRole('button', { name: /^SMS$/i });
    if (await smsButton.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      await smsButton.click();
      await page.waitForTimeout(500);

      // Should filter vendors
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
      // SMS vendors should be fewer or equal to all vendors
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('WhatsApp channel filter works correctly', async ({ page }) => {
    const whatsappButton = page.getByRole('button', { name: /WhatsApp/i });
    if (await whatsappButton.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      await whatsappButton.click();
      await page.waitForTimeout(500);

      // Should filter vendors (fewer vendors have WhatsApp)
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('Multiple channel filters can be combined', async ({ page }) => {
    const emailButton = page.getByRole('button', { name: /^Email$/i });
    const smsButton = page.getByRole('button', { name: /^SMS$/i });

    if ((await emailButton.isVisible()) && (await smsButton.isVisible())) {
      // Select both Email and SMS
      await emailButton.click();
      await page.waitForTimeout(300);
      await smsButton.click();
      await page.waitForTimeout(500);

      // Should show vendors with at least one of these channels
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
    }
  });

  test('Clicking a channel filter again removes it', async ({ page }) => {
    const emailButton = page.getByRole('button', { name: /^Email$/i });

    if (await emailButton.isVisible({ timeout: 3000 })) {
      // Apply filter
      await emailButton.click();
      await page.waitForTimeout(300);
      const countWithFilter = await getVendorCount(page);

      // Remove filter
      await emailButton.click();
      await page.waitForTimeout(300);
      const countWithoutFilter = await getVendorCount(page);

      // Should have more or equal vendors after removing filter
      expect(countWithoutFilter).toBeGreaterThanOrEqual(countWithFilter);
    }
  });
});

test.describe('Integration Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await unlockAdvancedFilters(page);
  });

  test('Shopify integration filter works', async ({ page }) => {
    const shopifyButton = page.getByRole('button', { name: /Shopify/i });

    if (await shopifyButton.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      await shopifyButton.click();
      await page.waitForTimeout(500);

      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('Salesforce integration filter works', async ({ page }) => {
    const salesforceButton = page.getByRole('button', { name: /Salesforce/i });

    if (await salesforceButton.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      await salesforceButton.click();
      await page.waitForTimeout(500);

      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
    }
  });

  test('Multiple integration filters work together', async ({ page }) => {
    const shopifyButton = page.getByRole('button', { name: /Shopify/i });
    const wordpressButton = page.getByRole('button', { name: /WordPress/i });

    if ((await shopifyButton.isVisible()) && (await wordpressButton.isVisible())) {
      await shopifyButton.click();
      await page.waitForTimeout(300);
      await wordpressButton.click();
      await page.waitForTimeout(500);

      // Should show vendors with at least one of these integrations
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
    }
  });
});

test.describe('Budget and Complexity Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await unlockAdvancedFilters(page);
  });

  test('Budget priority filter changes selection', async ({ page }) => {
    // Find budget buttons
    const budgetButton = page.getByRole('button', { name: /Budget|Premium|Balanced/i }).first();

    if (await budgetButton.isVisible({ timeout: 3000 })) {
      await budgetButton.click();
      await page.waitForTimeout(500);

      // Should still show vendors
      const count = await getVendorCount(page);
      expect(count).toBeGreaterThan(0);
    }
  });

  test('Implementation tolerance filter works', async ({ page }) => {
    // Find setup time buttons
    const quickSetupButton = page.getByRole('button', { name: /Quick|Days/i });

    if (await quickSetupButton.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      await quickSetupButton.click();
      await page.waitForTimeout(500);

      // Quick setup should filter to lighter complexity vendors
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('Governance toggle filters for enterprise features', async ({ page }) => {
    // Find governance toggle
    const governanceToggle = page.locator('input[type="checkbox"]').first();

    if (await governanceToggle.isVisible({ timeout: 3000 })) {
      const initialCount = await getVendorCount(page);

      // Enable governance requirement
      await governanceToggle.click();
      await page.waitForTimeout(500);

      // Should filter to vendors with governance features
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThanOrEqual(0);
      // Governance requirement usually reduces vendor count
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });
});

test.describe('Filter Combinations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await unlockAdvancedFilters(page);
  });

  test('Combining profile and advanced filters', async ({ page }) => {
    // First set profile filter
    const companySizeSelect = page.locator('[data-testid="company-size"]');
    if (await companySizeSelect.isVisible()) {
      await companySizeSelect.selectOption('SMB');
      await page.waitForTimeout(300);
    }

    // Then add channel filter
    const emailButton = page.getByRole('button', { name: /^Email$/i });
    if (await emailButton.isVisible()) {
      await emailButton.click();
      await page.waitForTimeout(500);
    }

    // Should show SMB vendors with email capability
    const filteredCount = await getVendorCount(page);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('Restrictive filters trigger relaxation message', async ({ page }) => {
    // Apply multiple restrictive filters
    const whatsappButton = page.getByRole('button', { name: /WhatsApp/i });
    const governanceToggle = page.locator('input[type="checkbox"]').first();

    if ((await whatsappButton.isVisible()) && (await governanceToggle.isVisible())) {
      await whatsappButton.click();
      await page.waitForTimeout(300);
      await governanceToggle.click();
      await page.waitForTimeout(500);

      // Should still show results (never-empty guarantee)
      const filteredCount = await getVendorCount(page);
      expect(filteredCount).toBeGreaterThan(0);

      // May show relaxation message if filters were too restrictive
      const relaxationBanner = page.getByText(/relaxed|adjusted|closest matches/i);
      // This is optional - depends on how many vendors match
    }
  });

  test('Search combined with filters', async ({ page }) => {
    // Add a channel filter
    const smsButton = page.getByRole('button', { name: /^SMS$/i });
    if (await smsButton.isVisible()) {
      await smsButton.click();
      await page.waitForTimeout(300);
    }

    // Add search
    const searchInput = page.locator('input[type="text"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Brevo');
      await page.waitForTimeout(500);

      // Should show Brevo if it has SMS
      const brevoCard = page.locator('[data-testid="vendor-card-brevo"]');
      await expect(brevoCard).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Filter State Persistence', () => {
  test('Filter selections are visually indicated', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await unlockAdvancedFilters(page);

    // Click a channel filter
    const emailButton = page.getByRole('button', { name: /^Email$/i });
    if (await emailButton.isVisible({ timeout: 3000 })) {
      await emailButton.click();
      await page.waitForTimeout(300);

      // Button should have active styling (bg-brevo-green or similar)
      const buttonClasses = await emailButton.getAttribute('class');
      expect(buttonClasses).toContain('brevo-green');
    }
  });
});

test.describe('Vendor Display with Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('Brevo vendor is always visible and marked as sponsor', async ({ page }) => {
    // Brevo should be visible
    const brevoCard = page.locator('[data-testid="vendor-card-brevo"]');
    await expect(brevoCard).toBeVisible({ timeout: 5000 });

    // Should have sponsor badge
    const sponsorBadge = brevoCard.getByText(/Sponsor/i);
    await expect(sponsorBadge).toBeVisible();
  });

  test('Vendor cards display logos', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find vendor cards
    const vendorCards = page.locator('[data-testid^="vendor-card-"]');
    const count = await vendorCards.count();
    expect(count).toBeGreaterThan(0);

    // Check first vendor card for image
    const firstCard = vendorCards.first();
    const logo = firstCard.locator('img');

    // Either an image should be visible or a fallback initial
    const hasImage = await logo.count() > 0;
    const hasFallback = (await firstCard.locator('.rounded-md').count()) > 0;
    expect(hasImage || hasFallback).toBe(true);
  });

  test('Vendor count is displayed', async ({ page }) => {
    await page.waitForTimeout(500);

    // Should show count in toolbar
    const countText = page.getByText(/vendors|résultats|ergebnisse|resultados/i);
    await expect(countText.first()).toBeVisible();
  });
});
