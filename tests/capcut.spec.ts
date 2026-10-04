import { test } from '@playwright/test';
import { shortDelay, mediumDelay, longDelay } from '../lib/humanDelays';

export async function generateWithCapCut(prompt: string): Promise<string> {
  const { chromium } = require('playwright');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: process.env.CAPCUT_STORAGE_STATE || undefined,
  });
  const page = await context.newPage();

  try {
    // 1. Open CapCut AI video generator
    await page.goto('https://www.capcut.com/tools/ai-video-generator', { waitUntil: 'domcontentloaded' });
    await mediumDelay();

    // TODO: Handle login if needed.

    // 2. Enter prompt (CapCut often has a big text box for script/prompt)
    const textarea = await page
      .locator('textarea[aria-label*="prompt"], textarea[placeholder*="prompt"], textarea:not([aria-label])')
      .first();
    await textarea.fill('');
    await textarea.type(prompt, { delay: 40 });
    await mediumDelay();

    // 3. Click Generate / Create
    await page.click('button:has-text("Generate"), button:has-text("Create"), button:has-text("AI generate")');
    await longDelay();

    // 4. Wait for result
    await page.waitForSelector('video, button:has-text("Download"), [class*="video"]', { timeout: 120000 });
    await mediumDelay();

    // 5. Download video
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;

    const path = `output/capcut-${Date.now()}.mp4`;
    await download.saveAs(path);

    return path;
  } finally {
    await browser.close();
  }
}

// Manual test for later
test('manual capcut generation', async ({ page }) => {
  const prompt = "A cinematic shot of a man walking through a desert at sunset, warm lighting, slow motion";
  const path = await generateWithCapCut(prompt);
  console.log('Generated video:', path);
});
