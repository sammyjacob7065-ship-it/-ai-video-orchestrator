import { test } from '@playwright/test';
import { shortDelay, mediumDelay, longDelay } from '../lib/humanDelays';

export async function generateWithKling(prompt: string): Promise<string> {
  const { chromium } = require('playwright');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: process.env.KLING_STORAGE_STATE || undefined,
  });
  const page = await context.newPage();

  try {
    // 1. Open Kling AI (adjust URL if your account uses a different entry)
    await page.goto('https://kling.ai/', { waitUntil: 'domcontentloaded' });
    await mediumDelay();

    // TODO: Handle login if not using saved storageState.

    // 2. Navigate to text-to-video or image-to-video section
    // This selector will be refined once we test in browser.
    await page.click('a:has-text("AI Video"), button:has-text("AI Video"), [href*="video"]');
    await mediumDelay();

    // 3. Enter prompt
    const textarea = await page
      .locator('textarea[aria-label*="prompt"], textarea[placeholder*="prompt"], textarea:not([aria-label])')
      .first();
    await textarea.fill('');
    await textarea.type(prompt, { delay: 40 });
    await mediumDelay();

    // 4. Click Generate
    await page.click('button:has-text("Generate"), button:has-text("Create")');
    await longDelay();

    // 5. Wait for result (video or download button)
    await page.waitForSelector('video, button:has-text("Download"), [class*="video"]', { timeout: 120000 });
    await mediumDelay();

    // 6. Download video
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;

    const path = `output/kling-${Date.now()}.mp4`;
    await download.saveAs(path);

    return path;
  } finally {
    await browser.close();
  }
}

// Manual test for later
test('manual kling generation', async ({ page }) => {
  const prompt = "A cinematic shot of a man walking through a desert at sunset, warm lighting, slow motion";
  const path = await generateWithKling(prompt);
  console.log('Generated video:', path);
});
