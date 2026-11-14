/**
 * Bone / muscle module — density change vs exercise adherence.
 */
import type { HealthModule } from "./types";

export const boneMuscle: HealthModule = {
  id: "bone_muscle",
  name: "Bone & Muscle",
  hazard: "G",
  bodyRegion: "hips",
  indicators: ["boneDensityChangePct", "exerciseMinutes"],
  evaluate(state) {
    const bone = state.day.boneDensityChangePct;
    const exercise = state.day.exerciseMinutes;
    const reasons: string[] = [];
    const evidenceIds = ["bone-loss-rate"];

    let level: "green" | "amber" | "red" = "green";
    let score = Math.min(90, Math.round(Math.abs(bone) * 12));

    if (bone <= -4 || (state.scenario === "skipped-exercise" && bone <= -1.5)) {
      level = "red";
      score = Math.max(score, 78);
      reasons.push(
        `Estimated bone density change ${bone.toFixed(2)}% with low countermeasure adherence (1–1.5%/month risk without countermeasures).`
      );
    } else if (bone <= -1.5 || exercise < 20) {
      level = "amber";
      score = Math.max(score, 52);
      reasons.push(
        `Bone projection ${bone.toFixed(2)}% and exercise ${exercise} min today suggest incomplete countermeasures.`
      );
    } else {
      reasons.push(
        `Bone projection ${bone.toFixed(2)}% with ${exercise} min exercise is within the demo green band.`
      );
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "bm-1", text: "Complete today's resistive exercise block (or make-up session).", minutes: 45 },
        { id: "bm-2", text: "Log load and sets in the exercise checklist." },
        { id: "bm-3", text: "Review weekly adherence; schedule catch-up if under target." },
      ],
      countermeasures: [
        { id: "bm-cm-1", name: "Resistive exercise", detail: "Protect weight-bearing bones (hips, legs, spine)." },
        { id: "bm-cm-2", name: "Nutrition support", detail: "Confirm protein / calcium plan for the day." },
      ],
      timeToActMinutes: level === "red" ? 120 : 720,
    };
  },
};
