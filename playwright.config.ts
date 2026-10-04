import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 3 * 60 * 1000, // 3 minutes per test
  use: {
    browserName: 'chromium',
    headless: false, // start with visible browser; we can switch later
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15000,
  },
  reporter: 'list',
});
