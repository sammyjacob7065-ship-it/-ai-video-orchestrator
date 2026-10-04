import { shortDelay, mediumDelay, longDelay } from '../lib/humanDelays';

export async function generateWithVidu(prompt: string): Promise<string> {
  const { chromium } = require('playwright');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: process.env.VIDU_STORAGE_STATE || undefined,
  });
  const page = await context.newPage();

  try {
    // 1. Open Vidu
    await page.goto('https://www.vidu.com/', { waitUntil: 'domcontentloaded' });
    await mediumDelay();

    // TODO: Handle login if needed.

    // 2. Go to image-to-video or text-to-video section
    await page.click('a:has-text("AI Video"), a:has-text("Image to Video"), button:has-text("Create")');
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

    // 5. Wait for result
    await page.waitForSelector('video, button:has-text("Download"), [class*="video"]', { timeout: 120000 });
    await mediumDelay();

    // 6. Download video
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;

    const path = `output/vidu-${Date.now()}.mp4`;
    await download.saveAs(path);

    return path;
  } finally {
    await browser.close();
  }
}
