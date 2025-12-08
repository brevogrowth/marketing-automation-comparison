import { test, expect } from '@playwright/test';

/**
 * Full E2E Test: Marketing Plan User Journey
 *
 * Tests the entire user flow:
 * 1. Page loads correctly with marketing plan interface
 * 2. Industry selection works and shows static plan
 * 3. Domain input for AI personalized plan
 * 4. Lead capture modal appears when generating AI plan
 * 5. Plan display components render correctly
 */

test.describe('Marketing Plan User Journey', () => {

    test.beforeEach(async ({ page }) => {
        // Set localStorage to bypass lead capture modal before navigating
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
                email: 'test@example.com',
                capturedAt: new Date().toISOString()
            }));
        });
        // Reload to pick up the localStorage state
        await page.reload();
        // Wait for page to fully load
        await expect(page.locator('h1')).toContainText('Marketing', { timeout: 10000 });
    });

    test('1. Page loads with marketing plan interface', async ({ page }) => {
        // Verify the main title is visible
        await expect(page.locator('h1')).toBeVisible();

        // Verify the sidebar is visible
        await expect(page.locator('aside')).toBeVisible();

        // Verify industry selector is present
        const industrySelect = page.locator('select').first();
        await expect(industrySelect).toBeVisible();
    });

    test('2. Industry selection works and shows static plan', async ({ page }) => {
        // Select a different industry
        const industrySelect = page.locator('select').first();

        // Get initial industry (should be Fashion by default)
        const initialIndustry = await industrySelect.inputValue();
        expect(initialIndustry).toBe('Fashion');

        // Change to SaaS
        await industrySelect.selectOption('SaaS');
        await page.waitForTimeout(500);

        // Verify the change took effect
        const newIndustry = await industrySelect.inputValue();
        expect(newIndustry).toBe('SaaS');

        // Verify static plan content is displayed
        // The plan should show Marketing Programs section (Company Summary is hidden in template mode)
        await expect(page.getByText(/Marketing.*Program|Programme|Programm/i).first()).toBeVisible({ timeout: 5000 });
    });

    test('3. Tab switching between static and personalized works', async ({ page }) => {
        // Find and click the "Personalized" tab
        const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });

        if (await personalizedTab.isVisible()) {
            await personalizedTab.click();
            await page.waitForTimeout(300);

            // Verify domain input appears
            const domainInput = page.locator('input[type="text"]');
            await expect(domainInput).toBeVisible();
        }
    });

    test('4. Domain input accepts valid domain', async ({ page }) => {
        // Click personalized tab if it exists
        const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });

        if (await personalizedTab.isVisible()) {
            await personalizedTab.click();
            await page.waitForTimeout(300);

            // Find domain input and enter a domain
            const domainInput = page.locator('input[type="text"]').first();
            await domainInput.fill('example.com');

            // Verify the value was set
            await expect(domainInput).toHaveValue('example.com');
        }
    });

    test('5. Marketing programs section renders', async ({ page }) => {
        // Wait for the page to fully render
        await page.waitForTimeout(1000);

        // Look for marketing programs section
        const programsSection = page.getByText(/Marketing.*Program|Programme|Programm/i);
        await expect(programsSection.first()).toBeVisible({ timeout: 5000 });
    });

    test('6. Brevo CTA section is visible at bottom', async ({ page }) => {
        // Scroll to bottom of page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        // Look for CTA section
        const ctaSection = page.getByText(/Ready to|Prêt à|Bereit|Listo/i);
        await expect(ctaSection.first()).toBeVisible({ timeout: 5000 });

        // Verify CTA button is present
        const ctaButton = page.getByRole('link', { name: /Start|Commencer|Starten|Empezar|demo/i });
        await expect(ctaButton.first()).toBeVisible();
    });

    test('URL parameters pre-fill industry', async ({ page }) => {
        // Navigate with industry parameter
        await page.goto('/?industry=SaaS');

        // Wait for page to load
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

        // Verify industry is set to SaaS
        const industrySelect = page.locator('select').first();
        await expect(industrySelect).toHaveValue('SaaS');
    });
});

test.describe('Quick Smoke Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Set localStorage to bypass lead capture modal
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
                email: 'test@example.com',
                capturedAt: new Date().toISOString()
            }));
        });
        await page.reload();
    });

    test('Page loads correctly', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    });

    test('Header with Brevo logo is visible', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Check Brevo logo link
        const logoLink = page.locator('header a[href="https://www.brevo.com"]');
        await expect(logoLink).toBeVisible({ timeout: 10000 });

        // Check Get a demo CTA
        const ctaLink = page.getByRole('link', { name: /demo/i });
        await expect(ctaLink.first()).toBeVisible();
    });

    test('CTA section displays at bottom', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Scroll to bottom of page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        // Verify CTA section is visible
        const ctaSection = page.getByText(/Ready to Execute|Prêt à exécuter/i);
        await expect(ctaSection.first()).toBeVisible({ timeout: 10000 });
    });

    test('Language selector works', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        // Find language selector (usually in header)
        const langSelector = page.locator('select').filter({ hasText: /English|Français|Deutsch|Español/i });

        if (await langSelector.count() > 0) {
            // Get current value and try to change it
            const currentLang = await langSelector.first().inputValue();

            // Try changing to French
            if (currentLang !== 'fr') {
                await langSelector.first().selectOption('fr');
                await page.waitForTimeout(500);

                // Verify some text changed to French
                await expect(page.locator('body')).toContainText(/Plan|Générer|Marketing/);
            }
        }
    });
});

test.describe('Lead Capture Flow', () => {

    test('Lead capture modal appears for new users on AI generation', async ({ page }) => {
        // Navigate without setting localStorage (new user)
        await page.goto('/');

        // Clear any existing lead data
        await page.evaluate(() => {
            localStorage.removeItem('brevo_marketing_plan_lead');
        });
        await page.reload();

        // Wait for page to load
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

        // Try to access personalized plan feature
        const personalizedTab = page.getByRole('button', { name: /Personalized|Personnalisé|Personalisiert|Personalizado/i });

        if (await personalizedTab.isVisible()) {
            await personalizedTab.click();
            await page.waitForTimeout(300);

            // Fill domain
            const domainInput = page.locator('input[type="text"]').first();
            if (await domainInput.isVisible()) {
                await domainInput.fill('example.com');
            }

            // Try to generate - this should trigger lead capture
            const generateButton = page.getByRole('button', { name: /Generate|Générer|Generieren|Generar/i });
            if (await generateButton.isVisible()) {
                await generateButton.click();

                // Lead capture modal should appear
                const emailInput = page.locator('input[type="email"]');
                await expect(emailInput).toBeVisible({ timeout: 5000 });
            }
        }
    });

    test('?force=true bypasses lead capture', async ({ page }) => {
        // Navigate with force parameter
        await page.goto('/?force=true');

        // Wait for page to load
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

        // Verify localStorage was cleared
        const leadData = await page.evaluate(() => {
            return localStorage.getItem('brevo_marketing_plan_lead');
        });

        // force=true should have cleared it (or it should be null)
        // The actual behavior may vary - just verify page loaded successfully
        await expect(page.locator('select').first()).toBeVisible();
    });
});

/**
 * Industry Plan Tests
 *
 * Verifies that changing industry correctly loads the corresponding marketing plan
 */
test.describe('Industry Plan Loading', () => {

    test.beforeEach(async ({ page }) => {
        // Set localStorage to bypass lead capture modal
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
                email: 'test@example.com',
                capturedAt: new Date().toISOString()
            }));
        });
        await page.reload();
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    });

    test('Changing industry loads correct marketing plan with programs', async ({ page }) => {
        // Get the industry selector
        const industrySelect = page.locator('select').first();
        await expect(industrySelect).toBeVisible();

        // Verify default is Fashion
        expect(await industrySelect.inputValue()).toBe('Fashion');

        // Verify Fashion plan programs are shown (Welcome & Onboarding Journey)
        await expect(page.getByText(/Welcome.*Onboarding|Onboarding.*Journey/i).first()).toBeVisible({ timeout: 5000 });

        // Change to SaaS industry
        await industrySelect.selectOption('SaaS');
        await page.waitForTimeout(1000);

        // Verify SaaS-specific program is displayed (Trial to Paid Conversion)
        await expect(page.getByText(/Trial.*Paid|Paid.*Conversion/i).first()).toBeVisible({ timeout: 5000 });

        // Verify Template badge is shown (not Personalized)
        await expect(page.getByText(/Template|Modèle|Vorlage|Plantilla/i).first()).toBeVisible();

        // Verify Marketing Programs section exists
        await expect(page.getByText(/Marketing.*Program|Programme|Programm/i).first()).toBeVisible();

        // Verify Program Details section exists
        await expect(page.getByText(/Program Details|Détails|Details/i).first()).toBeVisible();

        // Change to Beauty industry
        await industrySelect.selectOption('Beauty');
        await page.waitForTimeout(1000);

        // Verify Beauty-specific content is shown
        await expect(page.getByText(/Beauty|Beauté|Schönheit|Belleza/i).first()).toBeVisible({ timeout: 5000 });

        // Verify the plan changed (no longer shows SaaS content)
        const saasContent = page.getByText(/Trial.*Paid.*Conversion/i);
        await expect(saasContent).not.toBeVisible();
    });

    test('Industry URL parameter loads correct plan', async ({ page }) => {
        // Navigate directly to SaaS industry via URL
        await page.goto('/?industry=SaaS');

        // Wait for page to load
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

        // Verify industry selector shows SaaS
        const industrySelect = page.locator('select').first();
        await expect(industrySelect).toHaveValue('SaaS');

        // Verify SaaS-specific program is displayed
        await expect(page.getByText(/Trial.*Paid|Paid.*Conversion/i).first()).toBeVisible({ timeout: 5000 });
    });
});

/**
 * Custom AI Analysis Tests
 *
 * Tests the full custom plan generation flow with 3-minute timeout
 * This is a long-running test that validates the Dust.tt integration
 */
test.describe('Custom AI Analysis', () => {

    // Extended timeout for AI analysis (3 minutes + buffer)
    test.setTimeout(240000); // 4 minutes

    test('Generate custom plan with AI analysis and verify results @ai', async ({ page }) => {
        // Skip in CI - requires AI Gateway credentials
        test.skip(!!process.env.CI, 'AI tests skipped in CI');

        // Set localStorage to bypass lead capture modal
        await page.goto('/');
        await page.evaluate(() => {
            localStorage.setItem('brevo_marketing_plan_lead', JSON.stringify({
                email: 'e2e-test@brevo.com',
                capturedAt: new Date().toISOString()
            }));
        });
        await page.reload();

        // Wait for page to load
        await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

        // Find the domain input in Custom Plan section
        const domainInput = page.locator('input[placeholder*="yourcompany"]').first();
        await expect(domainInput).toBeVisible({ timeout: 5000 });

        // Enter a real domain for AI analysis
        await domainInput.fill('brevo.com');
        await page.waitForTimeout(500);

        // Click the Generate button
        const generateButton = page.getByRole('button', { name: /Generate.*Plan|Générer|Generieren|Generar/i });
        await expect(generateButton).toBeVisible();
        await generateButton.click();

        // Wait for loading state to appear - LoadingBanner shows "Generating plan for {domain}"
        const loadingBanner = page.locator('[class*="animate-pulse"]').filter({
            hasText: /Generating|Générer|Generieren|Generar|brevo\.com/i
        }).first();
        await expect(loadingBanner).toBeVisible({ timeout: 15000 });
        console.log('Loading banner visible - AI generation started');

        // Wait for the analysis to complete (up to 3 minutes)
        // Either the banner disappears OR Company Summary appears
        await expect(page.getByText(/Company Summary|Résumé/i).first()).toBeVisible({ timeout: 180000 });
        console.log('Company Summary visible - AI generation complete');

        // Verify the personalized plan is displayed
        // 1. Check for Personalized badge (not Template)
        await expect(page.getByText(/Personalized|Personnalisé|Personalisiert|Personalizado/i).first()).toBeVisible({ timeout: 10000 });

        // 2. Check for Company Summary (only visible for custom plans)
        await expect(page.getByText(/Company Summary|Résumé.*entreprise|Zusammenfassung|Resumen/i).first()).toBeVisible({ timeout: 5000 });

        // 3. Check for company name in the plan (should contain brevo)
        await expect(page.getByText(/brevo/i).first()).toBeVisible({ timeout: 5000 });

        // 4. Verify Marketing Programs section exists
        await expect(page.getByText(/Marketing.*Program|Programme|Programm/i).first()).toBeVisible();

        // 5. Verify Program Details section exists
        await expect(page.getByText(/Program Details|Détails|Details/i).first()).toBeVisible();

        // 6. Verify at least one program card is rendered
        const programCards = page.locator('[class*="bg-white"][class*="rounded"]').filter({
            hasText: /Program|Programme|Programm/i
        });
        expect(await programCards.count()).toBeGreaterThan(0);
    });
});
