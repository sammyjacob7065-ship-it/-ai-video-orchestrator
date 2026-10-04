import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';

const outputDir = path.join(process.cwd(), 'output');
const logFile = path.join(outputDir, 'run.log');
const logLines: string[] = [];

function log(msg: string) {
  logLines.push(msg);
  console.log(msg);
}

async function generateVideoWithGoogle(prompt: string, outputDir: string): Promise<string | null> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    log('Navigating to Google AI Studio...');
    await page.goto('https://aistudio.google.com/app/live', { waitUntil: 'domcontentloaded' });

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Check if there's a "Veo" button
    const hasVeoButton = await page.locator('span:has-text("Veo")').count() > 0;

    if (!hasVeoButton) {
      log('No Veo button found – likely not logged in or no access');
      return null;
    }

    log('Clicking Veo button...');
    await page.locator('span:has-text("Veo")').first().click();
    await page.waitForTimeout(3000);

    log('Filling prompt...');
    await page.locator('textarea[aria-label="Describe your video"]').fill(prompt);
    await page.waitForTimeout(2000);

    log('Clicking Generate...');
    await page.locator('button:has-text("Generate")').first().click();

    // Wait for generation to complete (look for "Save" or "Download" button)
    log('Waiting for generation to complete...');
    await page.waitForFunction(
      () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(b => b.textContent?.includes('Save') || b.textContent?.includes('Download'));
      },
      { timeout: 5 * 60 * 1000 }
    );

    await page.waitForTimeout(3000);

    // Try to click "Save" or "Download"
    const saveButton = page.locator('button:has-text("Save")').first();
    const downloadButton = page.locator('button:has-text("Download")').first();

    if (await saveButton.count() > 0) {
      log('Clicking Save...');
      await saveButton.click();
    } else if (await downloadButton.count() > 0) {
      log('Clicking Download...');
      await downloadButton.click();
    } else {
      log('No Save/Download button found');
      return null;
    }

    await page.waitForTimeout(5000);

    // For now, we can't easily save the file in headless mode.
    // We'll just log success and return a placeholder path.
    const videoPath = path.join(outputDir, 'google-video.mp4');
    log('✅ Video generated (placeholder): ' + videoPath);
    return videoPath;
  } catch (err) {
    log('❌ Error in generateVideoWithGoogle: ' + (err as Error).message);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const prompt =
    process.env.INPUT_PROMPT ||
    'A cinematic shot of a man walking through a desert at sunset, warm lighting, slow motion';

  log('Running video generator script...');
  log('Prompt:', prompt);
  log('Output directory:', outputDir);

  try {
    log('Calling generateVideoWithGoogle...');
    const videoPath = await generateVideoWithGoogle(prompt, outputDir);

    if (videoPath && fs.existsSync(videoPath)) {
      log('✅ Generated video: ' + videoPath);
    } else if (videoPath) {
      log('⚠️ Video reported as generated but file not found: ' + videoPath);
    } else {
      log('❌ generateVideoWithGoogle returned null');
    }
  } catch (err) {
    log('❌ Error in generateVideoWithGoogle: ' + (err as Error).message);
  }

  // Write log file
  fs.writeFileSync(logFile, logLines.join('\n'), 'utf-8');
  log('Log written to: ' + logFile);

  process.exit(0);
}

main();
