import * as fs from 'fs';
import * as path from 'path';
import { generateVideo } from './helpers.js';

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

  try {
    log('Calling generateVideo...');
    const videoPath = await generateVideo(prompt, outputDir);

    if (videoPath && fs.existsSync(videoPath)) {
      log('✅ Generated video: ' + videoPath);
    } else {
      log('❌ generateVideo returned no video path');
    }
  } catch (err) {
    log('❌ Error in generateVideo: ' + (err as Error).message);
  }

  // Write log file
  fs.writeFileSync(logFile, logLines.join('\n'), 'utf-8');
  log('Log written to: ' + logFile);

  process.exit(0);
}

main();
