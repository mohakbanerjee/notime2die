/**
 * Radiation module — cumulative dose vs career limit; SPE scenario spikes.
 */
import type { HealthModule } from "./types";

export const radiation: HealthModule = {
  id: "radiation",
  name: "Radiation",
  hazard: "R",
  bodyRegion: "skin",
  indicators: ["cumulativeDoseMsv"],
  evaluate(state) {
    const dose = state.day.cumulativeDoseMsv;
    const career = 600;
    const pct = (dose / career) * 100;
    const spe = state.scenario === "solar-particle";
    const reasons: string[] = [];
    const evidenceIds = ["career-dose-limit", "rad-cruise-mars", "rad-surface-mars", "ridge-hazards"];

    let level: "green" | "amber" | "red" = "green";
    let score = Math.min(95, Math.round(pct * 0.8));

    if (spe) {
      level = "red";
      score = Math.max(score, 92);
      reasons.push(
        "Solar particle event scenario active — dose rate elevated; shelter protocol recommended."
      );
      evidenceIds.push("mars-blackout");
    } else if (pct >= 50) {
      level = "red";
      score = Math.max(score, 80);
      reasons.push(`Cumulative dose ${dose.toFixed(1)} mSv is ≥50% of the 600 mSv career reference.`);
    } else if (pct >= 25) {
      level = "amber";
      score = Math.max(score, 55);
      reasons.push(`Cumulative dose ${dose.toFixed(1)} mSv is ≥25% of the 600 mSv career reference.`);
    } else {
      reasons.push(`Cumulative dose ${dose.toFixed(1)} mSv remains under 25% of the 600 mSv career reference.`);
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "rad-1", text: "Move to designated storm shelter / highest shielding volume now.", minutes: 2 },
        { id: "rad-2", text: "Confirm shelter occupancy and seal checklist.", minutes: 5 },
        { id: "rad-3", text: "Log dosimeter reading and start 30-minute recheck timer.", minutes: 30 },
        { id: "rad-4", text: "Defer EVA / external tasks until all-clear criteria are met." },
      ],
      countermeasures: [
        { id: "rad-cm-1", name: "Shelter", detail: "Maximize shielding mass between crew and free space." },
        { id: "rad-cm-2", name: "Timeline shift", detail: "Reschedule high-exposure tasks after the event window." },
      ],
      timeToActMinutes: spe || level === "red" ? 3 : 60,
    };
  },
};
