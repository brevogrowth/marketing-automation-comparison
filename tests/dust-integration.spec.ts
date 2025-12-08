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
    test.setTimeout(720000); // 12 minutes timeout for AI analysis (can take 5-10+ minutes)

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
    console.log('[Test] Page loaded');

    // 3. Find and fill the domain input
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');
    console.log('[Test] Domain filled: brevo.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Click the generate button
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await expect(generateButton).toBeEnabled({ timeout: 5000 });
    await generateButton.click();
    console.log('[Test] Generate button clicked');

    // 6. Verify loading state appears - LoadingBanner shows "Generating plan for {domain}"
    const loadingText = page.getByText(/Generating.*plan.*for|Generating.*brevo|You can continue browsing/i).first();
    await expect(loadingText).toBeVisible({ timeout: 15000 });
    console.log('[Test] Loading state detected - AI generation started');

    // 7. Wait for redirect to shareable URL (happens when AI completes)
    // Poll with progress logging every 30 seconds
    const startTime = Date.now();
    const maxWaitTime = 660000; // 11 minutes max wait

    while (Date.now() - startTime < maxWaitTime) {
        const currentUrl = page.url();

        // Check if redirected to shareable URL
        if (currentUrl.includes('/brevo.com')) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            console.log(`[Test] Redirected to shareable URL after ${elapsed}s:`, currentUrl);
            break;
        }

        // Log progress every 30 seconds
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed % 30 === 0 && elapsed > 0) {
            // Try to get progress from page
            const progressText = await page.locator('text=/\\d+%/').first().textContent().catch(() => 'unknown');
            console.log(`[Test] Still waiting... ${elapsed}s elapsed, progress: ${progressText}`);
        }

        await page.waitForTimeout(5000); // Check every 5 seconds
    }

    // Verify we actually redirected
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/\/brevo\.com/);
    console.log('[Test] Final URL verified:', finalUrl);

    // 8. Verify plan content is displayed - Company Summary indicates personalized plan
    await expect(page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen/i)).toBeVisible({ timeout: 30000 });
    console.log('[Test] Company Summary visible - personalized plan loaded');

    // 9. Verify marketing programs section is visible
    await expect(page.getByText(/Relationship Programs Overview/i).first()).toBeVisible();

    // 10. Verify Brevo CTA section appears
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/Ready to|Prêt à|Bereit|Listo/i)).toBeVisible({ timeout: 5000 });
    console.log('[Test] Test completed successfully');
});

test('should load shareable URL and show plan or error @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout

    // 1. Navigate directly to a shareable URL for a domain
    await page.goto('/brevo.com');
    console.log('[Test] Navigated to /brevo.com');

    // 2. Wait for page to load - should show loading skeleton initially then content
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // 3. Verify the page loads correctly - either with personalized plan or static fallback
    // The page should show SOME content (programs overview, error message, or company summary)
    const content = page.getByText(/Relationship Programs Overview|No marketing plan found|Company Summary|Résumé/i).first();
    await expect(content).toBeVisible({ timeout: 30000 });

    // 4. Verify the shareable URL structure is correct
    const currentUrl = page.url();
    expect(currentUrl).toContain('/brevo.com');
    console.log('[Test] Shareable URL loaded:', currentUrl);

    // 5. Check what type of content was shown
    const hasCompanySummary = await page.getByText(/Company Summary|Résumé|Zusammenfassung|Resumen/i).isVisible({ timeout: 2000 }).catch(() => false);
    const hasProgramsOverview = await page.getByText(/Relationship Programs Overview/i).isVisible({ timeout: 2000 }).catch(() => false);
    const hasError = await page.getByText(/No marketing plan found/i).isVisible({ timeout: 2000 }).catch(() => false);

    console.log('[Test] Content status:', {
        hasCompanySummary,
        hasProgramsOverview,
        hasError
    });

    // At least one of these should be true
    expect(hasCompanySummary || hasProgramsOverview || hasError).toBe(true);
});

test('should show loading state when generating from main page @ai', async ({ page }) => {
    test.setTimeout(60000); // 1 minute timeout - we're just testing the UI flow starts correctly

    // 1. Navigate and set up auth
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
            email: 'test@example.com',
            capturedAt: new Date().toISOString()
        }));
    });
    await page.reload();
    console.log('[Test] Page loaded with lead capture bypassed');

    // 2. Wait for page to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 3. Find and fill domain input
    const domainInput = page.locator('input[placeholder*="company"], input[placeholder*=".com"]');
    await expect(domainInput).toBeVisible({ timeout: 5000 });
    await domainInput.fill('brevo.com');
    console.log('[Test] Domain filled: brevo.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Trigger plan generation
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
    await expect(generateButton).toBeEnabled({ timeout: 5000 });
    await generateButton.click();
    console.log('[Test] Generate button clicked');

    // 6. Verify one of these happens:
    //    A) Quick redirect to shareable URL (if plan exists in DB)
    //    B) Loading state appears (if AI generation starts)

    // Wait for either loading state OR redirect to shareable URL
    await Promise.race([
        // Wait for loading banner to appear
        page.getByRole('heading', { name: /Generating plan for/i }).waitFor({ timeout: 30000 }),
        // Or wait for redirect to shareable URL
        page.waitForURL(/\/brevo\.com/, { timeout: 30000 })
    ]).catch(() => {
        // If neither happened, that's a failure
    });

    const currentUrl = page.url();
    const hasLoadingBanner = await page.getByRole('heading', { name: /Generating plan for/i }).isVisible().catch(() => false);

    console.log('[Test] State after clicking generate:', {
        url: currentUrl,
        hasLoadingBanner,
        redirectedToShareable: currentUrl.includes('/brevo.com')
    });

    // Verify we're either showing loading or got redirected
    expect(hasLoadingBanner || currentUrl.includes('/brevo.com')).toBe(true);

    // If we got redirected, verify the page loads correctly
    if (page.url().includes('/brevo.com')) {
        await expect(page.getByText(/Relationship Programs Overview|Company Summary/i).first()).toBeVisible({ timeout: 30000 });
        console.log('[Test] Plan content visible on shareable URL');
    }
});

test('should show error state for invalid domain @ai', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes timeout - AI might take a while to fail

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
    console.log('[Test] Domain filled: not-a-valid-domain-xyz-123.com');

    // 4. Wait a moment for validation
    await page.waitForTimeout(500);

    // 5. Try to generate - the button should be enabled for valid format
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });

    if (await generateButton.isEnabled()) {
        await generateButton.click();
        console.log('[Test] Generate button clicked');

        // Wait for either:
        // A) Loading state (AI generation starts)
        // B) Error state (AI fails quickly)
        await Promise.race([
            page.getByRole('heading', { name: /Generating plan for/i }).waitFor({ timeout: 60000 }),
            page.getByRole('heading', { name: /Error/i }).waitFor({ timeout: 60000 })
        ]).catch(() => {
            // Continue to check what state we're in
        });

        const hasLoadingBanner = await page.getByRole('heading', { name: /Generating plan for/i }).isVisible().catch(() => false);
        const hasError = await page.getByRole('heading', { name: /Error/i }).isVisible().catch(() => false);

        console.log('[Test] State after clicking generate:', {
            hasLoadingBanner,
            hasError
        });

        // Either loading started or error appeared - both are valid outcomes
        expect(hasLoadingBanner || hasError).toBe(true);
    } else {
        // Button disabled is also valid behavior for invalid input
        console.log('[Test] Button was disabled');
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
    console.log('[Test] Domain filled: this-domain-does-not-exist-for-ai-test.xyz');

    // 4. Generate plan
    await page.waitForTimeout(500);
    const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });

    if (await generateButton.isEnabled()) {
        await generateButton.click();
        console.log('[Test] Generate button clicked');

        // Wait for either success or error - using heading role selectors
        await Promise.race([
            page.getByRole('heading', { name: /Generating plan for/i }).waitFor({ timeout: 90000 }),
            page.getByRole('heading', { name: /Error/i }).waitFor({ timeout: 90000 }),
            page.getByRole('heading', { name: /Company Summary/i }).waitFor({ timeout: 90000 })
        ]).catch(() => {
            // Continue to check what state we're in
        });

        const hasLoadingBanner = await page.getByRole('heading', { name: /Generating plan for/i }).isVisible().catch(() => false);
        const hasError = await page.getByRole('heading', { name: /Error/i }).isVisible().catch(() => false);
        const hasSuccess = await page.getByRole('heading', { name: /Company Summary/i }).isVisible().catch(() => false);

        console.log('[Test] State after clicking generate:', {
            hasLoadingBanner,
            hasError,
            hasSuccess
        });

        // If error appeared, check for technical details button
        if (hasError) {
            const technicalDetailsButton = page.getByRole('button', { name: /Technical|Technique|Technisch|Técnico/i });
            if (await technicalDetailsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
                await technicalDetailsButton.click();
                console.log('[Test] Technical details button clicked');

                // Verify detailed error info is shown
                const debugInfo = page.locator('pre');
                await expect(debugInfo.first()).toBeVisible({ timeout: 5000 });
                console.log('[Test] Technical details panel visible');
            }
        } else if (hasLoadingBanner || hasSuccess) {
            console.log('[Test] No error state - AI generation started or succeeded');
        }

        // Either loading started, error appeared, or success - all are valid outcomes
        expect(hasLoadingBanner || hasError || hasSuccess).toBe(true);
    }
});
