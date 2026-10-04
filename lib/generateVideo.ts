import { loadCreditState, saveCreditState, canUseProvider, type CreditState } from './creditTracker';

// These functions will be implemented in the tests folder.
// For now we declare their types so TypeScript is happy.
type GenerateFn = (prompt: string) => Promise<string>;

let generateWithGoogleFlow: GenerateFn;
let generateWithKling: GenerateFn;
let generateWithVidu: GenerateFn;
let generateWithCapCut: GenerateFn;

// We'll assign the real functions later once we create the provider files.
export function setProviders(fns: {
  google: GenerateFn;
  kling: GenerateFn;
  vidu: GenerateFn;
  capcut: GenerateFn;
}) {
  generateWithGoogleFlow = fns.google;
  generateWithKling = fns.kling;
  generateWithVidu = fns.vidu;
  generateWithCapCut = fns.capcut;
}

export async function generateVideo(
  prompt: string,
  options?: {
    preferProvider?: 'google' | 'kling' | 'vidu' | 'capcut';
  }
) {
  const state = await loadCreditState();

  const order: Array<'google' | 'kling' | 'vidu' | 'capcut'> = options?.preferProvider
    ? [options.preferProvider, ...(['google', 'kling', 'vidu', 'capcut'] as const).filter(p => p !== options.preferProvider)]
    : ['google', 'kling', 'vidu', 'capcut'];

  for (const provider of order) {
    if (!canUseProvider(state, provider)) {
      console.log(`Skipping ${provider} (no credits / disabled)`);
      continue;
    }

    try {
      console.log(`Trying ${provider}...`);
      let videoPath: string | null = null;

      if (provider === 'google') {
        videoPath = await generateWithGoogleFlow(prompt);
      } else if (provider === 'kling') {
        videoPath = await generateWithKling(prompt);
      } else if (provider === 'vidu') {
        videoPath = await generateWithVidu(prompt);
      } else if (provider === 'capcut') {
        videoPath = await generateWithCapCut(prompt);
      }

      if (videoPath) {
        state[provider].usedToday += 1;
        await saveCreditState(state);
        return { provider, path: videoPath };
      }
    } catch (err) {
      console.error(`${provider} failed:`, err);
      // continue to next provider
    }
  }

  throw new Error('All providers failed or out of credits');
}
