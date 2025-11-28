import { test, expect } from '@playwright/test';

/**
 * Full E2E Test: Complete User Journey
 *
 * Tests the entire user flow:
 * 1. Change industry and price tier → verify benchmark values change
 * 2. Click "Enter My KPIs" → verify analysis mode with metric selection
 * 3. Select metrics and change their values
 * 4. Generate AI analysis → wait up to 3 minutes for result
 * 5. Export PDF
 */

test.describe('Full User Journey', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for page to fully load
        await expect(page.locator('h1')).toContainText('Marketing KPI Benchmark');
    });

    test('1. Industry and Price Tier selection changes benchmark values', async ({ page }) => {
        // Get initial benchmark values for Fashion (default)
        // Open first category section if not already open
        await page.locator('button:has-text("Strategic Efficiency")').click();

        // Get a benchmark value (e.g., CAC median value)
        const initialMedianText = await page.locator('text=Median:').first().textContent();

        // Change industry to SaaS
        await page.locator('select').first().selectOption('SaaS');

        // Wait for the UI to update
        await page.waitForTimeout(500);

        // Verify the benchmark values have changed
        const newMedianText = await page.locator('text=Median:').first().textContent();

        // Values should be different for different industries
        expect(initialMedianText).not.toEqual(newMedianText);

        // Change price tier to Luxury
        await page.locator('select').nth(1).selectOption('Luxury');
        await page.waitForTimeout(500);

        // Verify values changed again
        const luxuryMedianText = await page.locator('text=Median:').first().textContent();
        expect(newMedianText).not.toEqual(luxuryMedianText);
    });

    test('2. Enter My KPIs activates analysis mode with metric selection', async ({ page }) => {
        // Click "Enter My KPIs" button
        await page.getByRole('button', { name: 'Enter My KPIs' }).click();

        // Verify the button changes to "Done Comparing"
        await expect(page.getByRole('button', { name: 'Done Comparing' })).toBeVisible();

        // Verify checkboxes appear for metric selection
        const checkboxes = page.locator('input[type="checkbox"]');
        await expect(checkboxes.first()).toBeVisible();

        // Verify some KPIs are pre-selected (cac, repeat_rate, conv_rate)
        const checkedBoxes = page.locator('input[type="checkbox"]:checked');
        const count = await checkedBoxes.count();
        expect(count).toBeGreaterThanOrEqual(3);

        // Verify sliders/inputs are now visible
        await expect(page.locator('input[type="range"]').first()).toBeVisible();

        // Verify the "Ready to Analyze" box appears
        await expect(page.getByText('Ready to Analyze')).toBeVisible();

        // Verify "Get My AI Recommendations" button is visible
        await expect(page.getByRole('button', { name: /Get My AI Recommendations/i })).toBeVisible();
    });

    test('3. Can select metrics and change their values', async ({ page }) => {
        // Activate analysis mode
        await page.getByRole('button', { name: 'Enter My KPIs' }).click();

        // Open Acquisition section
        await page.locator('button:has-text("Acquisition")').click();
        await page.waitForTimeout(300);

        // Find a checkbox that's not checked and click it
        const uncheckedBox = page.locator('input[type="checkbox"]:not(:checked)').first();
        if (await uncheckedBox.count() > 0) {
            await uncheckedBox.click();

            // Verify it's now checked
            await expect(uncheckedBox).toBeChecked();
        }

        // Find an enabled number input and change its value
        const numberInput = page.locator('input[type="number"]:not([disabled])').first();
        await numberInput.fill('50');

        // Verify the value was set
        await expect(numberInput).toHaveValue('50');

        // Find a slider and change its value
        const slider = page.locator('input[type="range"]').first();
        await slider.fill('100');

        // The corresponding number input should update
        const firstNumberInput = page.locator('input[type="number"]').first();
        await expect(firstNumberInput).not.toHaveValue('0');
    });

    test('4. Generate AI Analysis and wait for results (up to 3 minutes)', async ({ page }) => {
        // Set a longer timeout for this specific test
        test.setTimeout(240000); // 4 minutes

        // Activate analysis mode
        await page.getByRole('button', { name: 'Enter My KPIs' }).click();

        // Open a section and ensure we have some values
        await page.locator('button:has-text("Strategic Efficiency")').click();

        // Click Generate Analysis
        await page.getByRole('button', { name: /Get My AI Recommendations/i }).click();

        // Verify loading state appears
        await expect(page.getByText(/Analyzing your data|Comparing with market data|Identifying opportunities|Crafting recommendations/)).toBeVisible({ timeout: 10000 });

        // Verify the AI Analysis section title appears
        await expect(page.getByText('AI Analysis')).toBeVisible({ timeout: 10000 });

        // Wait for the analysis to complete (up to 3 minutes)
        // The result will show "AI Performance Analysis" header
        await expect(page.getByRole('heading', { name: /AI Performance Analysis/i })).toBeVisible({ timeout: 180000 });

        // Verify the analysis content is displayed
        // Looking for common sections in the AI response
        const analysisContent = page.locator('.prose');
        await expect(analysisContent).toBeVisible();

        // The analysis should contain some text
        const textContent = await analysisContent.textContent();
        expect(textContent?.length).toBeGreaterThan(100);
    });

    test('5. Export PDF button is available after analysis', async ({ page }) => {
        // Set a longer timeout for this specific test
        test.setTimeout(240000); // 4 minutes

        // Activate analysis mode
        await page.getByRole('button', { name: 'Enter My KPIs' }).click();

        // Generate analysis
        await page.getByRole('button', { name: /Get My AI Recommendations/i }).click();

        // Wait for analysis to complete
        await expect(page.getByRole('heading', { name: /AI Performance Analysis/i })).toBeVisible({ timeout: 180000 });

        // Verify Export PDF button is visible
        const exportButton = page.getByRole('button', { name: /Export PDF/i });
        await expect(exportButton).toBeVisible();

        // Click the button (this will trigger print dialog which we can't fully test)
        // But we can verify the button is clickable
        await expect(exportButton).toBeEnabled();
    });

    test('URL parameters pre-fill industry and price tier', async ({ page }) => {
        // Navigate with URL parameters
        await page.goto('/?industry=SaaS&priceTier=Luxury');

        // Wait for page to load
        await expect(page.locator('h1')).toContainText('Marketing KPI Benchmark');

        // Verify industry is set to SaaS
        const industrySelect = page.locator('select').first();
        await expect(industrySelect).toHaveValue('SaaS');

        // Verify price tier is set to Luxury
        const priceTierSelect = page.locator('select').nth(1);
        await expect(priceTierSelect).toHaveValue('Luxury');
    });

    test('Complete user journey - end to end', async ({ page }) => {
        // This is the full journey test combining all steps
        test.setTimeout(300000); // 5 minutes total

        // Step 1: Change industry and price tier
        await page.locator('select').first().selectOption('Beauty');
        await page.locator('select').nth(1).selectOption('Mid-Range');

        // Step 2: Enter analysis mode
        await page.getByRole('button', { name: 'Enter My KPIs' }).click();
        await expect(page.getByRole('button', { name: 'Done Comparing' })).toBeVisible();

        // Step 3: Open Retention section and modify a value
        await page.locator('button:has-text("Retention")').click();
        await page.waitForTimeout(500);

        // Find repeat rate metric and ensure it's selected
        const repeatRateCheckbox = page.locator('input[type="checkbox"]').nth(0);
        if (!(await repeatRateCheckbox.isChecked())) {
            await repeatRateCheckbox.click();
        }

        // Change a slider value
        const slider = page.locator('input[type="range"]').first();
        if (await slider.isVisible()) {
            await slider.fill('25');
        }

        // Step 4: Generate AI Analysis
        await page.getByRole('button', { name: /Get My AI Recommendations/i }).click();

        // Verify loading state
        await expect(page.locator('#analysis-section')).toBeVisible({ timeout: 5000 });

        // Wait for analysis to complete
        await expect(page.getByRole('heading', { name: /AI Performance Analysis/i })).toBeVisible({ timeout: 180000 });

        // Step 5: Verify Export PDF is available
        await expect(page.getByRole('button', { name: /Export PDF/i })).toBeVisible();

        // Verify analysis has content
        const analysisContent = page.locator('.prose');
        await expect(analysisContent).toBeVisible();
        const text = await analysisContent.textContent();
        expect(text?.length).toBeGreaterThan(100);
    });
});

test.describe('Quick Smoke Tests (no AI)', () => {

    test('Page loads correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('Marketing KPI Benchmark', { timeout: 10000 });
    });

    test('All category sections can be expanded', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Test Strategic Efficiency section (first one)
        const strategicButton = page.locator('button:has-text("Strategic Efficiency")');
        await expect(strategicButton).toBeVisible({ timeout: 10000 });
        await strategicButton.click();
        await page.waitForTimeout(500);

        // Test Acquisition section
        const acquisitionButton = page.locator('button:has-text("Acquisition")');
        await expect(acquisitionButton).toBeVisible();
        await acquisitionButton.click();
        await page.waitForTimeout(500);
    });

    test('Intro toggles work correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Click "How does it work?" toggle
        const howToggle = page.getByText('How does it work?');
        await expect(howToggle).toBeVisible({ timeout: 10000 });
        await howToggle.click();
        await expect(page.getByText('Explore industry benchmarks')).toBeVisible({ timeout: 5000 });
    });

    test('Header links work', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check Brevo logo link
        const logoLink = page.locator('header a[href="https://www.brevo.com"]');
        await expect(logoLink).toBeVisible({ timeout: 10000 });

        // Check Get a demo CTA
        const ctaLink = page.getByRole('link', { name: 'Get a demo' });
        await expect(ctaLink).toBeVisible();
    });

    test('Contributors section displays partners', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Scroll to bottom of page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        // Verify partner logos are present
        await expect(page.locator('img[alt="Cartelis"]')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('img[alt="Epsilon"]')).toBeVisible();
        await expect(page.locator('img[alt="Niji"]')).toBeVisible();
    });
});
