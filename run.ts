import * as fs from 'fs';
import * as path from 'path';
import { generateWithGoogle } from './providers/google.js';
import { generateWithKling } from './providers/kling.js';
import { generateWithVidu } from './providers/vidu.js';
import { generateWithCapCut } from './providers/capcut.js';

const outputDir = path.join(process.cwd(), 'output');
const logFile = path.join(outputDir, 'run.log');
const logLines: string[] = [];

function log(msg: string) {
  logLines.push(msg);
  console.log(msg);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const prompt =
    process.env.INPUT_PROMPT ||
    'A cinematic shot of a man walking through a desert at sunset, warm lighting, slow motion';

  log('Running video generator script...');
  log('Prompt:', prompt);
  log('Output directory:', outputDir);

  const providers = [
    { name: 'google', fn: generateWithGoogle },
    { name: 'kling', fn: generateWithKling },
    { name: 'vidu', fn: generateWithVidu },
    { name: 'capcut', fn: generateWithCapCut },
  ];

  let success = false;

  for (const provider of providers) {
    try {
      log('');
      log('Trying ' + provider.name + '...');

      const videoPath = await provider.fn(prompt, outputDir);

      if (videoPath && fs.existsSync(videoPath)) {
        log('✅ Generated with: ' + provider.name + ' → ' + videoPath);
        success = true;
        break;
      } else {
        log('❌ ' + provider.name + ' returned no video');
      }
    } catch (err) {
      log('❌ Error with ' + provider.name + ': ' + (err as Error).message);
    }
  }

  if (!success) {
    log('❌ All providers failed or were skipped');
  }

  // Write log file
  fs.writeFileSync(logFile, logLines.join('\n'), 'utf-8');
  log('Log written to: ' + logFile);

  process.exit(0);
}

main();
