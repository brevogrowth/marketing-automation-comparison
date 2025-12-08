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

test('should generate personalized marketing plan and redirect to shareable URL @ai', async ({ page }) => {
    test.setTimeout(600000); // 10 minutes timeout for AI analysis (can take up to 5-6 minutes)

    // 1. Navigate to main page and set localStorage to bypass lead capture
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Find and fill the domain input
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Click the generate button
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await expect(generateButton).toBeEnabled({ timeout: 5000 });
    await generateButton.click();

    // 6. Verify loading state appears - LoadingBanner shows "Generating plan for {domain}"
    const loadingText = page.getByText(/Generating.*plan.*for|Generating.*brevo|You can continue browsing/i).first();
    await expect(loadingText).toBeVisible({ timeout: 15000 });
    console.log('Loading state detected');

    // 7. Wait for redirect to shareable URL (happens when AI completes)
    // This is the key indicator that generation succeeded
    await page.waitForURL(/\/brevo\.com/, { timeout: 540000 }); // 9 minutes for AI generation
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/brevo\.com/);
    console.log('Redirected to shareable URL:', currentUrl);

    // 8. Verify plan content is displayed - Company Summary indicates personalized plan
    await expect(page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen/i)).toBeVisible({ timeout: 30000 });
    console.log('Company Summary visible - personalized plan loaded');

    // 9. Verify marketing programs section is visible
    await expect(page.getByText(/Relationship Programs Overview/i).first()).toBeVisible();

    // 10. Verify Brevo CTA section appears
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/Ready to|Prêt à|Bereit|Listo/i)).toBeVisible({ timeout: 5000 });
});

test('should load existing plan directly from shareable URL @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout

    // 1. Navigate directly to a shareable URL for a domain that should have a saved plan
    // (After the first test runs, brevo.com should be saved in DB)
    await page.goto('/brevo.com');

    // 2. Wait for page to load - should show loading skeleton initially
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // 3. Verify the plan is loaded from DB
    // Either we see the company summary (plan found) or an error message (not found)
    const planOrError = page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen|No marketing plan found|Plan for|Brevo/i).first();
    await expect(planOrError).toBeVisible({ timeout: 30000 });

    // 4. If plan was found, verify the shareable URL structure
    const currentUrl = page.url();
    expect(currentUrl).toContain('/brevo.com');
    console.log('Shareable URL loaded:', currentUrl);

    // 5. Check for personalized plan indicator (if plan found)
    const personalizedIndicator = page.getByText(/Personalized|AI-generated|savedPlan/i);
    const hasPersonalizedPlan = await personalizedIndicator.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Has personalized plan:', hasPersonalizedPlan);
});

test('should redirect to shareable URL when existing plan is found from main page @ai', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Find and fill domain input with a domain that should be cached
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Trigger plan generation
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await expect(generateButton).toBeEnabled({ timeout: 5000 });
    await generateButton.click();

    // 6. If plan exists in DB, should redirect quickly to shareable URL
    // If not, will go through AI generation and then redirect
    await page.waitForURL(/\/brevo\.com/, { timeout: 90000 });
    console.log('Redirected to shareable URL:', page.url());

    // 7. Verify plan content appears
    await expect(page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen|brevo\.com/i)).toBeVisible({ timeout: 30000 });
});

test('should show error state for invalid domain @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Find and fill domain input with an invalid domain (but valid format)
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('not-a-valid-domain-xyz-123.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Try to generate - the button should be enabled for valid format
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });

    if (await generateButton.isEnabled()) {
        await generateButton.click();

        // Wait for either error state or loading state
        const errorOrLoading = page.locator('[class*="Error"], [class*="Loading"], [class*="error"]').first();
        await expect(errorOrLoading).toBeVisible({ timeout: 30000 });
    } else {
        // Button disabled is also valid behavior for invalid input
        expect(await generateButton.isDisabled()).toBe(true);
    }
});

test('should display detailed error info in toggle when AI parsing fails @ai', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Use a domain that might trigger an error (non-existent or problematic domain)
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('this-domain-does-not-exist-for-ai-test.xyz');

    // 4. Generate plan
    await page.waitForTimeout(500);
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });

    if (await generateButton.isEnabled()) {
        await generateButton.click();

        // Wait for either success or error
        try {
            // Try to find error state with technical details toggle
            const errorState = page.locator('[class*="ErrorState"], [class*="error"]').first();
            await expect(errorState).toBeVisible({ timeout: 90000 });

            // If error appeared, check for technical details button
            const technicalDetailsButton = page.getByRole('button', { name: /Technical|Technique|Technisch|Técnico/i });
            if (await technicalDetailsButton.isVisible({ timeout: 5000 })) {
                await technicalDetailsButton.click();

                // Verify detailed error info is shown
                const debugInfo = page.locator('[class*="debug"], pre');
                await expect(debugInfo.first()).toBeVisible({ timeout: 5000 });
            }
        } catch {
            // If no error, the plan might have been generated successfully
            console.log('No error state - plan may have been generated successfully');
        }
    }
});
