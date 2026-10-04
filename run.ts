import { generateVideo, setProviders } from './lib/generateVideo';
import { generateWithGoogleFlow } from './tests/google-flow.spec';
import { generateWithKling } from './tests/kling.spec';
import { generateWithVidu } from './tests/vidu.spec';
import { generateWithCapCut } from './tests/capcut.spec';

// Wire up the provider functions
setProviders({
  google: generateWithGoogleFlow,
  kling: generateWithKling,
  vidu: generateWithVidu,
  capcut: generateWithCapCut,
});

async function main() {
  const prompt =
    "A cinematic shot of a man walking through a desert at sunset, warm lighting, slow motion";

  try {
    const result = await generateVideo(prompt, { preferProvider: 'google' });
    console.log('✅ Generated with:', result.provider, '→', result.path);
  } catch (err) {
    console.error('❌ All providers failed:', err);
  }
}

main().catch(console.error);
