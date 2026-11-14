/**
 * Behavioral health — mood + local journal keyword flags (private by default).
 */
import type { HealthModule } from "./types";

export const behavioral: HealthModule = {
  id: "behavioral",
  name: "Behavioral Health",
  hazard: "I",
  bodyRegion: "mind",
  indicators: ["mood", "journalFlags"],
  evaluate(state) {
    const mood = state.selfReport?.mood ?? state.day.mood;
    const flags = state.selfReport?.journalFlags ?? [];
    const reasons: string[] = [];
    const evidenceIds = ["ridge-hazards", "hrp-risks", "eimo"];

    let level: "green" | "amber" | "red" = "green";
    let score = 12;

    if (mood <= 1.5 || flags.includes("crisis")) {
      level = "red";
      score = 88;
      reasons.push(`Mood ${mood}/5 and journal flags [${flags.join(", ") || "none"}] indicate urgent support needs.`);
    } else if (mood <= 2.5 || flags.length > 0 || state.scenario === "isolation-slump") {
      level = "amber";
      score = 55;
      reasons.push(
        `Mood ${mood}/5${flags.length ? ` with flags: ${flags.join(", ")}` : ""} — isolation / behavioral watch.`
      );
    } else {
      reasons.push(`Mood ${mood}/5 with no concerning journal flags.`);
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "bh-1", text: "Use the onboard peer-support / CMO check-in script.", minutes: 15 },
        { id: "bh-2", text: "Protect private journal unless you choose to share a summary." },
        { id: "bh-3", text: "Schedule a structured social / team activity this duty day." },
      ],
      countermeasures: [
        { id: "bh-cm-1", name: "Connection", detail: "Crew check-in; ground consult when delay allows." },
        { id: "bh-cm-2", name: "Workload", detail: "Reduce non-essential cognitive load for 24 h." },
      ],
      timeToActMinutes: level === "red" ? 15 : 360,
    };
  },
};
