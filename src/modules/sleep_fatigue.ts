/**
 * Sleep & fatigue — sleep hours + PVT median / lapses.
 */
import type { HealthModule } from "./types";

export const sleepFatigue: HealthModule = {
  id: "sleep_fatigue",
  name: "Sleep & Fatigue",
  hazard: "I",
  bodyRegion: "mind",
  indicators: ["sleepHours", "pvtMedianMs", "pvtLapses"],
  evaluate(state) {
    const sleep = state.selfReport?.sleepHours ?? state.day.sleepHours;
    const pvtMed = state.pvt?.medianMs ?? state.day.pvtMedianMs;
    const lapses = state.pvt?.lapses ?? state.day.pvtLapses;
    const reasons: string[] = [];
    const evidenceIds = ["iss-sleep-avg", "cognition-pvt"];

    let level: "green" | "amber" | "red" = "green";
    let score = 15;

    if (sleep < 5 || pvtMed > 400 || lapses >= 5) {
      level = "red";
      score = 82;
      reasons.push(
        `Sleep ${sleep.toFixed(1)} h and PVT median ${pvtMed} ms / ${lapses} lapses indicate high fatigue risk before a risky task.`
      );
    } else if (sleep < 6.09 || pvtMed > 300 || lapses >= 2) {
      level = "amber";
      score = 58;
      reasons.push(
        `Sleep ${sleep.toFixed(1)} h is at/below the ISS average (~6.09 h) or PVT is slowed (median ${pvtMed} ms).`
      );
    } else {
      reasons.push(`Sleep ${sleep.toFixed(1)} h and PVT median ${pvtMed} ms look nominal for this demo.`);
    }

    return {
      level,
      score,
      reasons,
      evidenceIds,
      protocol: [
        { id: "sf-1", text: "Defer high-risk EVA / robotics until a rest block is completed.", minutes: 30 },
        { id: "sf-2", text: "Start a protected sleep / nap opportunity; dim lights and reduce alerts.", minutes: 90 },
        { id: "sf-3", text: "Retake a short PVT before the next critical task." },
      ],
      countermeasures: [
        { id: "sf-cm-1", name: "Sleep hygiene", detail: "Protect circadian lighting and quiet hours." },
        { id: "sf-cm-2", name: "Task scheduling", detail: "Move error-sensitive work after recovery sleep." },
      ],
      timeToActMinutes: level === "red" ? 20 : 180,
    };
  },
};
