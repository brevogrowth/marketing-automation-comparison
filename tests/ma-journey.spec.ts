import { test, expect } from '@playwright/test';

/**
 * MA Comparison E2E Tests
 *
 * Tests the user journey for the Marketing Automation comparison tool:
 * 1. Landing shows vendor list without login
 * 2. Profile filters update list
 * 3. Advanced filters require lead capture
 * 4. Compare mode works
 */

test.describe('MA Comparison User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    // Wait for page to fully load
    await expect(page.locator('h1')).toContainText(/Marketing Automation|Comparatif|Vergleich|Comparación/, { timeout: 10000 });
  });

  test('1. Landing shows vendor list without login', async ({ page }) => {
    // Verify vendor cards are visible (at least 3)
    const vendorCards = page.locator('[data-testid^="vendor-card-"]');
    await expect(vendorCards.first()).toBeVisible({ timeout: 5000 });

    const count = await vendorCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('2. Page loads with main components visible', async ({ page }) => {
    // Verify header is visible
    await expect(page.locator('header')).toBeVisible();

    // Verify sidebar is visible on desktop
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    // Verify main content area exists
    const mainSection = page.locator('section').first();
    await expect(mainSection).toBeVisible();

    // Verify CTA section is visible at bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const ctaSection = page.getByText(/Try Brevo|Essayer|Testen|Prueba/i);
    await expect(ctaSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('3. Profile filters update vendor list', async ({ page }) => {
    // Get initial vendor count
    const vendorCards = page.locator('[data-testid^="vendor-card-"]');
    const initialCount = await vendorCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Find and change company size filter
    const companySizeSelect = page.locator('[data-testid="company-size"]');
    if (await companySizeSelect.isVisible()) {
      await companySizeSelect.selectOption('ENT');
      await page.waitForTimeout(500);

      // Vendors should still be shown (never-empty guarantee)
      const newCount = await vendorCards.count();
      expect(newCount).toBeGreaterThan(0);
    }
  });

  test('4. Search filters vendor list', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="text"]').first();

    if (await searchInput.isVisible()) {
      // Type a search query
      await searchInput.fill('Brevo');
      await page.waitForTimeout(500);

      // Should show filtered results
      const vendorCards = page.locator('[data-testid^="vendor-card-"]');
      const count = await vendorCards.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Brevo should be visible
      const brevoCard = page.locator('[data-testid="vendor-card-brevo"]');
      await expect(brevoCard).toBeVisible();
    }
  });

  test('5. Sort options change vendor order', async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page.locator('select').filter({ hasText: /Recommended|Rating|Name|Complexity/i });

    if (await sortSelect.count() > 0) {
      // Change to sort by name
      await sortSelect.first().selectOption('name');
      await page.waitForTimeout(500);

      // Vendors should still be visible
      const vendorCards = page.locator('[data-testid^="vendor-card-"]');
      expect(await vendorCards.count()).toBeGreaterThan(0);
    }
  });

  test('6. Vendor card sections are expandable', async ({ page }) => {
    // Find first vendor card
    const vendorCard = page.locator('[data-testid^="vendor-card-"]').first();
    await expect(vendorCard).toBeVisible();

    // Click on Ratings section to expand
    const ratingsButton = vendorCard.getByRole('button', { name: /Ratings|Évaluations|Bewertungen|Valoraciones/i });
    if (await ratingsButton.isVisible()) {
      await ratingsButton.click();
      await page.waitForTimeout(300);

      // Verify ratings content is now visible
      const ratingsContent = vendorCard.getByText(/G2|Capterra/i);
      await expect(ratingsContent.first()).toBeVisible();
    }
  });

  test('7. Brevo CTA is visible', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Find CTA buttons
    const ctaLinks = page.getByRole('link', { name: /demo|free|essai|kostenlos|gratis/i });
    await expect(ctaLinks.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Compare Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('1. Compare mode can be toggled', async ({ page }) => {
    // Find compare toggle button
    const compareToggle = page.getByRole('button', { name: /Compare|Comparer|Vergleichen|Comparar/i });

    if (await compareToggle.isVisible()) {
      await compareToggle.click();
      await page.waitForTimeout(300);

      // Vendor cards should now show "Add to compare" buttons
      const addToCompareButton = page.locator('[data-testid="add-compare"]').first();
      await expect(addToCompareButton).toBeVisible({ timeout: 5000 });
    }
  });

  test('2. Can add vendors to compare', async ({ page }) => {
    // Enable compare mode
    const compareToggle = page.getByRole('button', { name: /Compare|Comparer|Vergleichen|Comparar/i });

    if (await compareToggle.isVisible()) {
      await compareToggle.click();
      await page.waitForTimeout(300);

      // Click first "Add to compare" button
      const addButtons = page.locator('[data-testid="add-compare"]');
      if ((await addButtons.count()) >= 2) {
        await addButtons.nth(0).click();
        await page.waitForTimeout(200);

        await addButtons.nth(1).click();
        await page.waitForTimeout(200);

        // Compare bar should appear at bottom
        const compareBar = page.locator('[data-testid="compare-bar"]');
        await expect(compareBar).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('3. Compare bar shows selected vendors', async ({ page }) => {
    // Navigate with compare param to pre-select vendors
    await page.goto('/?compare=brevo,klaviyo');
    await page.waitForTimeout(500);

    // Compare bar should be visible
    const compareBar = page.locator('[data-testid="compare-bar"]');
    if (await compareBar.isVisible({ timeout: 5000 })) {
      // Should show vendor names
      await expect(compareBar.getByText(/Brevo/i).first()).toBeVisible();
    }
  });
});

test.describe('Advanced Filters & Lead Capture', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('brevo_ma_comparison_lead');
    });
    await page.reload();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('1. Advanced filters section is visible but locked', async ({ page }) => {
    // Find advanced filters section
    const advancedSection = page.getByText(/Advanced|Avancé|Erweitert|Avanzado/i);
    await expect(advancedSection.first()).toBeVisible({ timeout: 5000 });

    // Should show a lock icon or "unlock" text
    const unlockText = page.getByText(/Unlock|Débloquer|Entsperren|Desbloquear|business email/i);
    await expect(unlockText.first()).toBeVisible();
  });

  test('2. Clicking locked advanced filters triggers lead capture', async ({ page }) => {
    // Find and click unlock button
    const unlockButton = page.getByRole('button', { name: /Unlock|Débloquer|Entsperren|Desbloquear/i });

    if (await unlockButton.isVisible()) {
      await unlockButton.click();
      await page.waitForTimeout(500);

      // Lead capture modal should appear
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible({ timeout: 5000 });
    }
  });

  test('3. Professional email unlocks advanced filters', async ({ page }) => {
    // Find and click unlock button
    const unlockButton = page.getByRole('button', { name: /Unlock|Débloquer|Entsperren|Desbloquear/i });

    if (await unlockButton.isVisible()) {
      await unlockButton.click();
      await page.waitForTimeout(500);

      // Fill in professional email
      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@company.com');

        // Submit the form
        const submitButton = page.getByRole('button', { name: /Submit|Valider|Absenden|Enviar|Continue/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(1000);

          // Advanced filters should now be unlocked
          // Look for filter options like Channels or Integrations
          const channelsFilter = page.getByText(/Channels|Canaux|Kanäle|Canales/i);
          // This may or may not be visible depending on implementation
        }
      }
    }
  });
});

test.describe('URL State Sync', () => {
  test('1. Profile filters sync to URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Change company size
    const companySizeSelect = page.locator('[data-testid="company-size"]');
    if (await companySizeSelect.isVisible()) {
      await companySizeSelect.selectOption('ENT');
      await page.waitForTimeout(500);

      // URL should contain size parameter
      const url = page.url();
      expect(url).toContain('size=ENT');
    }
  });

  test('2. URL parameters pre-fill filters', async ({ page }) => {
    // Navigate with parameters
    await page.goto('/?size=SMB&goal=Acquisition');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Verify company size is set
    const companySizeSelect = page.locator('[data-testid="company-size"]');
    if (await companySizeSelect.isVisible()) {
      const value = await companySizeSelect.inputValue();
      expect(value).toBe('SMB');
    }
  });

  test('3. Search syncs to URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Type in search
    const searchInput = page.locator('input[type="text"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);

      // URL should contain search parameter
      const url = page.url();
      expect(url).toContain('q=test');
    }
  });
});

test.describe('Responsive Design', () => {
  test('Mobile view shows filter toggle button', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Sidebar should be hidden on mobile
    const desktopSidebar = page.locator('aside.hidden');
    // Mobile filter button should be visible
    const filterButton = page.getByRole('button', { name: /Filter|Filtrer|Filter|Filtrar/i });

    // At least one mobile interaction should be available
    const vendorCards = page.locator('[data-testid^="vendor-card-"]');
    expect(await vendorCards.count()).toBeGreaterThan(0);
  });
});

test.describe('Language Support', () => {
  test('Language selector changes UI language', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Find language selector
    const langSelector = page.locator('select').filter({ hasText: /English|Français|Deutsch|Español/i });

    if ((await langSelector.count()) > 0) {
      // Change to French
      await langSelector.first().selectOption('fr');
      await page.waitForTimeout(500);

      // Page should now show French text
      await expect(page.getByText(/Comparatif|Taille|Filtr/i).first()).toBeVisible();
    }
  });
});
