/**
 * Immune / illness — temperature + symptom chips.
 */
import type { HealthModule } from "./types";

export const immune: HealthModule = {
  id: "immune",
  name: "Immune / Illness",
  hazard: "E",
  bodyRegion: "lungs",
  indicators: ["skinTempC", "symptoms"],
  evaluate(state) {
    const temp = state.vitals.skinTempC;
    const symptoms = state.selfReport?.symptoms ?? [];
    const feverish = temp >= 38;
    const illnessSignals = symptoms.filter((s) =>
      ["nausea", "congestion", "rash", "headache"].includes(s)
    );
    const reasons: string[] = [];
    const evidenceIds = ["vitals-temp-bands", "bio-monitor", "ridge-hazards"];

    let level: "green" | "amber" | "red" = "green";
    let score = 10;

    if (feverish && illnessSignals.length >= 2) {
      level = "red";
      score = 80;
      reasons.push(
        `Temp ${temp}°C with symptoms [${illnessSignals.join(", ")}] — illness protocol.`
      );
    } else if (feverish || illnessSignals.length >= 1 || temp >= 37.5) {
      level = "amber";
      score = 50;
      reasons.push(
        `Temp ${temp}°C and/or symptoms [${illnessSignals.join(", ") || "none"}] warrant monitoring (demo temp bands).`
      );
    } else {
      reasons.push(`Temp ${temp}°C with no significant illness symptom cluster.`);
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "im-1", text: "Isolate from shared exercise equipment if febrile.", minutes: 5 },
        { id: "im-2", text: "Hydrate, rest, and recheck temperature in 30 minutes.", minutes: 30 },
        { id: "im-3", text: "Log symptoms for CMO / ground packet." },
      ],
      countermeasures: [
        { id: "im-cm-1", name: "Rest & fluids", detail: "Reduce duty load while febrile." },
      ],
      timeToActMinutes: level === "red" ? 20 : 180,
    };
  },
};
