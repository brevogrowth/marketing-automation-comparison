import { test, expect } from '@playwright/test';

/**
 * AI Integration Test: Marketing Plan Generation via Dust API
 *
 * Tests the AI-powered personalized plan generation flow.
 * Uses the /api/marketing-plan endpoint which communicates with Dust.tt.
 *
 * Note: These tests require AI Gateway credentials and are skipped in CI.
 * Run locally with: npx playwright test --grep "@ai"
 */

// Skip AI tests in CI (no AI Gateway credentials)
test.skip(!!process.env.CI, 'AI tests skipped in CI - requires AI Gateway credentials');

test('should generate personalized marketing plan via Dust API @ai', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes timeout for AI analysis

    // 1. Navigate to main page and set localStorage to bypass lead capture
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_kpi_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Switch to personalized plan tab
    const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });
    if (await personalizedTab.isVisible()) {
        await personalizedTab.click();
        await page.waitForTimeout(500);
    }

    // 4. Enter a domain for personalized plan
    const domainInput = page.locator('input[type="text"]').first();
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');

    // 5. Trigger plan generation
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // 6. Verify loading state appears
    await expect(page.getByText(/Generating|Drafting|Creating|Créer|Erstellen/i)).toBeVisible({ timeout: 10000 });

    // 7. Wait for plan to be generated (up to 3 minutes)
    // The result will show company summary section
    await expect(page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen/i)).toBeVisible({ timeout: 180000 });

    // 8. Verify plan content is displayed
    // Look for marketing programs section
    await expect(page.getByText(/Marketing.*Program|Programme|Programm/i)).toBeVisible();

    // 9. Verify Brevo CTA section appears
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/Ready to|Prêt à|Bereit|Listo/i)).toBeVisible({ timeout: 5000 });
});

test('should handle domain lookup for existing plan @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_kpi_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Switch to personalized plan tab
    const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });
    if (await personalizedTab.isVisible()) {
        await personalizedTab.click();
        await page.waitForTimeout(500);
    }

    // 4. Enter a domain that might have an existing plan (from previous test)
    const domainInput = page.locator('input[type="text"]').first();
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');

    // 5. Trigger plan generation
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await generateButton.click();

    // 6. Either loading state or immediate plan display (if cached)
    // Wait for plan content to appear
    await expect(page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen|Generating|Drafting/i)).toBeVisible({ timeout: 30000 });
});

test('should show error state for invalid domain @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_kpi_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Switch to personalized plan tab
    const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });
    if (await personalizedTab.isVisible()) {
        await personalizedTab.click();
        await page.waitForTimeout(500);
    }

    // 4. Enter an invalid domain
    const domainInput = page.locator('input[type="text"]').first();
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('not-a-valid-domain-xyz-123');

    // 5. Try to generate - should show validation error
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });

    // The button might be disabled for invalid domains, or show an error after click
    if (await generateButton.isEnabled()) {
        await generateButton.click();

        // Wait for error state or validation message
        await expect(page.getByText(/Invalid|Error|Erreur|Fehler|inválido/i)).toBeVisible({ timeout: 10000 });
    } else {
        // Button disabled is also valid behavior for invalid input
        expect(await generateButton.isDisabled()).toBe(true);
    }
});
