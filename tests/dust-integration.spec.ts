import { test, expect } from '@playwright/test';

test('should generate analysis via Dust API', async ({ page }) => {
    test.setTimeout(180000); // Increase timeout to 3 minutes for AI analysis

    // 1. Navigate to main page
    await page.goto('/');

    // 2. Wait for page to load
    await expect(page.locator('h1')).toContainText('Marketing KPI Benchmark');

    // 3. Activate Analysis Mode by clicking "Enter My KPIs"
    await page.getByRole('button', { name: /Enter My KPIs/i }).click();

    // Wait for analysis mode to activate
    await expect(page.getByRole('button', { name: /Done Comparing/i })).toBeVisible();

    // 4. Trigger Analysis
    const generateButton = page.getByRole('button', { name: /Get My AI Recommendations/i });
    await expect(generateButton).toBeVisible();
    await generateButton.click();

    // 5. Verify Loading State
    await expect(page.getByText(/Analyzing your data|Comparing with market data|Identifying opportunities|Crafting recommendations/)).toBeVisible({ timeout: 10000 });

    // 6. Verify Result
    // Wait for the result to appear (timeout increased as API might take time)
    await expect(page.getByRole('heading', { name: /AI Performance Analysis/i })).toBeVisible({ timeout: 180000 });

    // Verify analysis content is displayed
    const analysisContent = page.locator('.prose');
    await expect(analysisContent).toBeVisible();
    const textContent = await analysisContent.textContent();
    expect(textContent?.length).toBeGreaterThan(100);
});
