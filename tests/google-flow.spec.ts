import { shortDelay, mediumDelay, longDelay } from '../lib/humanDelays';

export async function generateWithGoogleFlow(prompt: string): Promise<string> {
  const { chromium } = require('playwright');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: process.env.GOOGLE_STORAGE_STATE || undefined,
  });
  const page = await context.newPage();

  try {
    // 1. Open Google Vids
    await page.goto('https://docs.google.com/vids', { waitUntil: 'domcontentloaded' });
    await mediumDelay();

    // TODO: Handle login handling here if needed (or rely on saved storageState).

    // 2. Click "Create AI videos"
    // Selector may need adjustment once we test in browser.
    await page.click('[data-tooltip="Create AI videos"], button:has-text("Create AI videos")');
    await shortDelay();

    // 3. Optional: upload reference images here if you want

    // 4. Enter prompt (human-like typing)
    const textarea = await page
      .locator('textarea[aria-label*="prompt"], textarea[placeholder*="Describe"]')
      .first();
    await textarea.fill('');
    await textarea.type(prompt, { delay: 40 });
    await mediumDelay();

    // 5. Click Generate
    await page.click('button:has-text("Generate"), button:has-text("Create")');
    await longDelay();

    // 6. Wait for video preview or download button
    await page.waitForSelector('video, button:has-text("Download")', { timeout: 120000 });
    await mediumDelay();

    // 7. Download video
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;

    const path = `output/google-${Date.now()}.mp4`;
    await download.saveAs(path);

    return path;
  } finally {
    await browser.close();
  }
}
