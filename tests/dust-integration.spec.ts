import { test, expect } from '@playwright/test';

test('should generate analysis via Dust API', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
    // 1. Navigate to V4 page
    await page.goto('http://localhost:3000/v4');

    // 2. Activate Analysis Mode
    // Click "Start Analysis" in the sidebar
    await page.getByRole('button', { name: 'Start Analysis' }).click();

    // Wait for the Generate button to appear
    const generateButton = page.getByRole('button', { name: 'Generate AI Analysis' });
    await expect(generateButton).toBeVisible();

    // 4. Trigger Analysis
    await generateButton.click();

    // 5. Verify Loading State
    // await expect(page.getByText('Analyzing your data...')).toBeVisible();

    // 6. Verify Result
    // Wait for the result to appear (timeout increased as API might take time)
    // We look for "Executive Summary" which is part of the markdown response
    // Wait for the result to appear (timeout increased as API might take time)
    // We look for "Executive Summary" which is part of the markdown response
    await expect(page.getByText('Executive Summary')).toBeVisible({ timeout: 60000 });

    // Verify other sections
    await expect(page.getByText('Traffic Light Analysis')).toBeVisible();
    await expect(page.getByText('Strategic Recommendations')).toBeVisible();
});
