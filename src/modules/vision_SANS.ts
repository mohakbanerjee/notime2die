/**
 * Vision / SANS — symptom checklist + self Amsler-style grid result.
 */
import type { HealthModule } from "./types";

export const visionSans: HealthModule = {
  id: "vision_SANS",
  name: "Vision / SANS",
  hazard: "D",
  bodyRegion: "eyes",
  indicators: ["blurred-vision", "visionGridOk", "headache"],
  evaluate(state) {
    const symptoms = state.selfReport?.symptoms ?? [];
    const blurred = symptoms.includes("blurred-vision");
    const headache = symptoms.includes("headache");
    const gridOk = state.selfReport?.visionGridOk ?? true;
    const reasons: string[] = [];
    const evidenceIds = ["sans-risk", "hrp-risks"];

    let level: "green" | "amber" | "red" = "green";
    let score = 10;

    if (blurred && !gridOk) {
      level = "red";
      score = 84;
      reasons.push("Blurred vision plus failed self grid test — SANS watch escalation.");
    } else if (blurred || !gridOk || (headache && blurred)) {
      level = "amber";
      score = 60;
      reasons.push(
        `Symptoms suggest SANS monitoring: blurred=${blurred}, gridOk=${gridOk}, headache=${headache}.`
      );
    } else {
      reasons.push("No blurred vision / grid failure reported for SANS screening.");
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "vs-1", text: "Repeat Amsler-style grid test in consistent lighting.", minutes: 5 },
        { id: "vs-2", text: "Photograph / log any distortion and notify CMO.", minutes: 10 },
        { id: "vs-3", text: "Avoid pressure-changing maneuvers until assessed." },
      ],
      countermeasures: [
        { id: "vs-cm-1", name: "Monitoring", detail: "Daily vision symptom + grid check while amber/red." },
      ],
      timeToActMinutes: level === "red" ? 30 : 240,
    };
  },
};
