/**
 * Mission profiles — changing mission sets the default delay preset;
 * delay can still be changed independently in the store.
 */
import { getEvidence } from "./evidence";

export type MissionProfile = {
  id: string;
  name: string;
  defaultDelayPresetId: string;
  gravityG: number;
  radiationDoseRateMsvPerDay: number;
  radiationEvidenceId: string;
  missionLengthDays: number;
};

function numEvidence(id: string, fallback: number): number {
  const e = getEvidence(id);
  return typeof e?.value === "number" ? e.value : fallback;
}

export const MISSIONS: MissionProfile[] = [
  {
    id: "iss",
    name: "ISS",
    defaultDelayPresetId: "iss",
    gravityG: 0,
    radiationDoseRateMsvPerDay: numEvidence("rad-iss-demo", 0.3),
    radiationEvidenceId: "rad-iss-demo",
    missionLengthDays: 180,
  },
  {
    id: "lunar-gateway",
    name: "Lunar Gateway",
    defaultDelayPresetId: "moon",
    gravityG: 0,
    radiationDoseRateMsvPerDay: numEvidence("rad-moon-demo", 0.5),
    radiationEvidenceId: "rad-moon-demo",
    missionLengthDays: 60,
  },
  {
    id: "mars-transit",
    name: "Mars transit",
    defaultDelayPresetId: "mars-far",
    gravityG: 0,
    radiationDoseRateMsvPerDay: numEvidence("rad-cruise-mars", 1.84),
    radiationEvidenceId: "rad-cruise-mars",
    missionLengthDays: 210,
  },
  {
    id: "mars-surface",
    name: "Mars surface",
    defaultDelayPresetId: "mars-close",
    gravityG: 0.38,
    radiationDoseRateMsvPerDay: numEvidence("rad-surface-mars", 0.64),
    radiationEvidenceId: "rad-surface-mars",
    missionLengthDays: 500,
  },
];

export function getMission(id: string): MissionProfile {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}
