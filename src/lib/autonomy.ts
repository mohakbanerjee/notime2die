/**
 * Autonomy mode from one-way delay + blackout.
 * Cutoffs live in evidence.ts as demoAssumption entries.
 */
import { getEvidence } from "./evidence";
import { roundTrip } from "./delay";

export type AutonomyMode = "EARTH_GUIDED" | "CREW_LED" | "FULL_AUTONOMY";

function cutoff(id: string, fallback: number): number {
  const e = getEvidence(id);
  return typeof e?.value === "number" ? e.value : fallback;
}

export function getAutonomyMode(
  oneWaySeconds: number,
  blackout: boolean
): AutonomyMode {
  if (blackout) return "FULL_AUTONOMY";
  const rt = roundTrip(oneWaySeconds);
  const earthGuidedMax = cutoff("autonomy-earth-guided-rt", 10);
  const crewLedMax = cutoff("autonomy-crew-led-rt", 3600);
  if (rt < earthGuidedMax) return "EARTH_GUIDED";
  if (rt <= crewLedMax) return "CREW_LED";
  return "FULL_AUTONOMY";
}

export function autonomyLabel(mode: AutonomyMode): string {
  switch (mode) {
    case "EARTH_GUIDED":
      return "EARTH GUIDED";
    case "CREW_LED":
      return "CREW LED";
    case "FULL_AUTONOMY":
      return "FULL AUTONOMY";
  }
}

export function autonomyReason(
  mode: AutonomyMode,
  oneWaySeconds: number,
  blackout: boolean
): string {
  if (blackout) {
    return "Link blackout (conjunction-style): crew runs the full protocol; Earth gets a log when the link returns.";
  }
  const rt = roundTrip(oneWaySeconds);
  if (mode === "EARTH_GUIDED") {
    return `Round trip ${rt.toFixed(1)} s is under 10 s — flag the issue and loop in the flight surgeon live.`;
  }
  if (mode === "CREW_LED") {
    return `Round trip is between 10 s and 1 h — crew executes steps now; a summary is queued home with reply ETA.`;
  }
  return `Round trip over 1 h — full onboard protocol; Earth receives a log later when the link allows.`;
}
