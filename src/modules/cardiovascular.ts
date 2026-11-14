/**
 * Cardiovascular module — HR, BP, SpO2 bands (demo assumptions).
 */
import type { HealthModule } from "./types";

export const cardiovascular: HealthModule = {
  id: "cardiovascular",
  name: "Cardiovascular",
  hazard: "D",
  bodyRegion: "chest",
  indicators: ["hr", "bpSys", "bpDia", "spo2"],
  evaluate(state) {
    const { hr, bpSys, bpDia, spo2 } = state.vitals;
    const reasons: string[] = [];
    const evidenceIds = ["vitals-hr-bands", "vitals-bp-bands", "vitals-spo2-bands", "bio-monitor"];
    let score = 10;
    let level: "green" | "amber" | "red" = "green";

    if (hr < 50 || hr > 110) {
      level = "red";
      score = 85;
      reasons.push(`Heart rate ${hr} bpm is outside the amber band (demo assumption bands).`);
    } else if (hr < 60 || hr > 100) {
      level = "amber";
      score = 55;
      reasons.push(`Heart rate ${hr} bpm is in the caution band (demo assumption).`);
    }

    if (bpSys < 90 || bpSys > 160 || bpDia > 100) {
      level = "red";
      score = Math.max(score, 80);
      reasons.push(`Blood pressure ${bpSys}/${bpDia} mmHg needs attention (demo BP bands).`);
    } else if (bpSys > 140 || bpDia > 90) {
      if (level === "green") level = "amber";
      score = Math.max(score, 50);
      reasons.push(`Blood pressure ${bpSys}/${bpDia} mmHg is elevated (demo BP bands).`);
    }

    if (spo2 < 90) {
      level = "red";
      score = Math.max(score, 90);
      reasons.push(`SpO2 ${spo2}% is critically low (demo SpO2 bands).`);
    } else if (spo2 < 95) {
      if (level === "green") level = "amber";
      score = Math.max(score, 60);
      reasons.push(`SpO2 ${spo2}% is below the green band (demo SpO2 bands).`);
    }

    if (reasons.length === 0) {
      reasons.push("Heart rate, blood pressure, and SpO2 are within demo green bands.");
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "cv-1", text: "Sit or secure yourself; breathe steadily for 60 seconds.", minutes: 1 },
        { id: "cv-2", text: "Recheck HR, BP, and SpO2 with wearable / Bio-Monitor style sensors.", minutes: 2 },
        { id: "cv-3", text: "If SpO2 stays under 95% or HR stays out of band, open Autonomy console and follow mode steps." },
      ],
      countermeasures: [
        { id: "cv-cm-1", name: "Hydration check", detail: "Confirm fluid intake schedule for the shift." },
        { id: "cv-cm-2", name: "Activity pause", detail: "Pause high-exertion tasks until vitals restabilize." },
      ],
      timeToActMinutes: level === "red" ? 5 : level === "amber" ? 30 : 240,
    };
  },
};
