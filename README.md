# AI Video Orchestrator

Multi-provider AI video generator using Playwright + browser automation.

Providers (in order):
1. Google Flow (Vids) – ~50 credits/day
2. Kling AI – ~66 credits/day
3. Vidu – smaller free allowance
4. CapCut – effectively unlimited fallback

## What it does

- Takes a text prompt
- Tries Google Flow first
- If Google fails or is out of credits, falls back to Kling → Vidu → CapCut
- Uses human-like delays to feel more natural
- Tracks daily usage per provider

## Files overview

- `playwright.config.ts` – Playwright configuration
- `run.ts` – Main runner script
- `lib/generateVideo.ts` – Orchestrator logic
- `lib/creditTracker.ts` – Daily credit tracking
- `lib/humanDelays.ts` – Human-like delay helpers
- `tests/google-flow.spec.ts` – Google Vids provider
- `tests/kling.spec.ts` – Kling AI provider
- `tests/vidu.spec.ts` – Vidu provider
- `tests/capcut.spec.ts` – CapCut provider

## How to run (later, locally)

1. Clone this repo:
   ```bash
   git clone <your-repo-url>
   cd ai-video-orchestrator
   ```
2. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```
3. Run:
   ```bash
   npm run run
   ```

For now, we’re just setting up the code in GitHub. We’ll handle running it locally in the next phase.
