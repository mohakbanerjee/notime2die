/**
 * Tiny local journal keyword lexicon — no API; private unless user shares.
 */
const LEXICON: Record<string, string[]> = {
  isolation: ["alone", "lonely", "isolated", "homesick", "miss home"],
  stress: ["stressed", "anxiety", "anxious", "overwhelmed", "panic"],
  sleep: ["insomnia", "can't sleep", "cannot sleep", "tired", "exhausted"],
  pain: ["hurt", "pain", "ache", "sore"],
  crisis: ["hopeless", "give up", "suicidal", "end it"],
};

export function analyzeJournal(text: string): string[] {
  const lower = text.toLowerCase();
  const flags: string[] = [];
  for (const [flag, words] of Object.entries(LEXICON)) {
    if (words.some((w) => lower.includes(w))) flags.push(flag);
  }
  return flags;
}
