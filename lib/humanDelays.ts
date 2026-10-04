export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function humanDelay(msMin: number, msMax: number) {
  const ms = randomInt(msMin, msMax);
  await new Promise(r => setTimeout(r, ms));
}

export const shortDelay = () => humanDelay(800, 2000);
export const mediumDelay = () => humanDelay(2000, 5000);
export const longDelay = () => humanDelay(5000, 12000);
