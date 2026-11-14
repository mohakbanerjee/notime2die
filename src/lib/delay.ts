/**
 * Comms delay presets and formatting.
 * Delay is NEVER hardcoded in UI — always read from the store / these helpers.
 */

export type DelayPreset = {
  id: string;
  label: string;
  oneWaySeconds: number;
  evidenceId: string;
};

export const DELAY_PRESETS: DelayPreset[] = [
  { id: "iss", label: "ISS", oneWaySeconds: 1, evidenceId: "iss-delay" },
  { id: "moon", label: "Moon", oneWaySeconds: 1.3, evidenceId: "light-time-moon" },
  { id: "mars-close", label: "Mars close", oneWaySeconds: 180, evidenceId: "light-time-mars-range" },
  { id: "mars-far", label: "Mars far", oneWaySeconds: 1320, evidenceId: "light-time-mars-range" },
  { id: "deep-space", label: "Deep space", oneWaySeconds: 15000, evidenceId: "light-time-neptune" },
];

export function getPreset(id: string): DelayPreset | undefined {
  return DELAY_PRESETS.find((p) => p.id === id);
}

export function resolveOneWaySeconds(
  presetId: string,
  customSeconds: number
): number {
  if (presetId === "custom") return customSeconds;
  return getPreset(presetId)?.oneWaySeconds ?? customSeconds;
}

export function roundTrip(oneWaySeconds: number): number {
  return oneWaySeconds * 2;
}

/** Human-readable delay: "1.3 s", "22 min", "4 h 10 min". */
export function formatDelay(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds < 60) {
    const s = seconds < 10 ? seconds.toFixed(1) : Math.round(seconds).toString();
    return `${s} s`;
  }
  if (seconds < 3600) {
    const m = seconds / 60;
    const shown = m < 10 && !Number.isInteger(m) ? m.toFixed(1) : Math.round(m).toString();
    return `${shown} min`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}
