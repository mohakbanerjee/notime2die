/**
 * Feature flags — hide unfinished features for the video without deleting code.
 */
export const FLAGS = {
  demoMode: true,
  pvtFull3Min: true,
  donkiOverlay: true,
  journalLexicon: true,
  osdrHooks: false,
} as const;

export type FlagName = keyof typeof FLAGS;

export function isEnabled(flag: FlagName): boolean {
  return FLAGS[flag];
}
