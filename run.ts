import * as fs from 'fs';
import * as path from 'path';

const outputDir = path.join(process.cwd(), 'output');
const logFile = path.join(outputDir, 'run.log');

const logLines: string[] = [];

function log(msg: string) {
  logLines.push(msg);
  console.log(msg);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  log('Script started');
  log('Output directory: ' + outputDir);

  // TODO: add video generation here later

  fs.writeFileSync(logFile, logLines.join('\n'), 'utf-8');
  log('Log written to: ' + logFile);

  process.exit(0);
}

main();
