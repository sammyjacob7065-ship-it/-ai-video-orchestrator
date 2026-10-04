type ProviderState = {
  dailyLimit: number;
  usedToday: number;
  lastResetDate: string; // YYYY-MM-DD
};

type CreditState = {
  google: ProviderState;
  kling: ProviderState;
  vidu: ProviderState;
  capcut: ProviderState;
};

const FILE = 'credit-state.json';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function resetIfNeeded(state: CreditState): CreditState {
  const today = todayStr();
  for (const key of ['google', 'kling', 'vidu', 'capcut'] as const) {
    if (state[key].lastResetDate !== today) {
      state[key].usedToday = 0;
      state[key].lastResetDate = today;
    }
  }
  return state;
}

export async function loadCreditState(): Promise<CreditState> {
  // In a real Node script this would read from disk.
  // For now, this is just the structure; we'll wire it up later.
  const today = todayStr();
  return {
    google: { dailyLimit: 5, usedToday: 0, lastResetDate: today },
    kling: { dailyLimit: 6, usedToday: 0, lastResetDate: today },
    vidu: { dailyLimit: 4, usedToday: 0, lastResetDate: today },
    capcut: { dailyLimit: 999, usedToday: 0, lastResetDate: today },
  };
}

export async function saveCreditState(state: CreditState) {
  // Will be implemented when we run locally.
  console.log('Saving credit state:', state);
}

export function canUseProvider(state: CreditState, provider: keyof CreditState) {
  const s = state[provider];
  return s.usedToday < s.dailyLimit;
}
