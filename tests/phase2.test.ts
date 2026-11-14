/** Phase 2: modules + triage autonomy behavior for the same alert. */
import { describe, expect, it } from "vitest";
import { cardiovascular } from "@/modules/cardiovascular";
import { radiation } from "@/modules/radiation";
import { boneMuscle } from "@/modules/bone_muscle";
import { sleepFatigue } from "@/modules/sleep_fatigue";
import { behavioral } from "@/modules/behavioral";
import { visionSans } from "@/modules/vision_SANS";
import { immune } from "@/modules/immune";
import type { ModuleState } from "@/modules/types";
import { triage } from "@/lib/triage";
import { DELAY_PRESETS } from "@/lib/delay";

function baseState(over: Partial<ModuleState> = {}): ModuleState {
  return {
    missionId: "lunar-gateway",
    missionDay: 10,
    vitals: {
      minute: 100,
      hr: 72,
      bpSys: 118,
      bpDia: 76,
      spo2: 98,
      respRate: 14,
      skinTempC: 36.6,
      activity: 0.2,
    },
    day: {
      day: 10,
      sleepHours: 7,
      exerciseMinutes: 50,
      cumulativeDoseMsv: 20,
      boneDensityChangePct: -0.4,
      mood: 3.5,
      pvtMedianMs: 250,
      pvtLapses: 0,
    },
    daySeries: [],
    scenario: "normal",
    ...over,
  };
}

describe("modules level for crafted inputs", () => {
  it("cardiovascular green/amber/red", () => {
    expect(cardiovascular.evaluate(baseState()).level).toBe("green");
    expect(
      cardiovascular.evaluate(
        baseState({ vitals: { ...baseState().vitals, hr: 105 } })
      ).level
    ).toBe("amber");
    expect(
      cardiovascular.evaluate(
        baseState({ vitals: { ...baseState().vitals, spo2: 88 } })
      ).level
    ).toBe("red");
  });

  it("radiation red on SPE", () => {
    expect(radiation.evaluate(baseState()).level).toBe("green");
    expect(radiation.evaluate(baseState({ scenario: "solar-particle" })).level).toBe("red");
  });

  it("bone_muscle amber/red on loss", () => {
    expect(
      boneMuscle.evaluate(
        baseState({
          day: { ...baseState().day, boneDensityChangePct: -2, exerciseMinutes: 10 },
        })
      ).level
    ).toBe("amber");
    expect(
      boneMuscle.evaluate(
        baseState({
          scenario: "skipped-exercise",
          day: { ...baseState().day, boneDensityChangePct: -2, exerciseMinutes: 5 },
        })
      ).level
    ).toBe("red");
  });

  it("sleep_fatigue red on short sleep + slow PVT", () => {
    expect(
      sleepFatigue.evaluate(
        baseState({
          day: { ...baseState().day, sleepHours: 4, pvtMedianMs: 450, pvtLapses: 6 },
        })
      ).level
    ).toBe("red");
  });

  it("behavioral / vision / immune respond to inputs", () => {
    expect(
      behavioral.evaluate(baseState({ day: { ...baseState().day, mood: 1 } })).level
    ).toBe("red");
    expect(
      visionSans.evaluate(
        baseState({
          selfReport: {
            day: 10,
            sleepHours: 7,
            mood: 3,
            symptoms: ["blurred-vision"],
            exerciseMinutes: 40,
            visionGridOk: false,
          },
        })
      ).level
    ).toBe("red");
    expect(
      immune.evaluate(
        baseState({
          vitals: { ...baseState().vitals, skinTempC: 38.4 },
          selfReport: {
            day: 10,
            sleepHours: 7,
            mood: 3,
            symptoms: ["nausea", "congestion"],
            exerciseMinutes: 20,
          },
        })
      ).level
    ).toBe("red");
  });
});

describe("triage flips with delay for same radiation alert", () => {
  const risk = radiation.evaluate(baseState({ scenario: "solar-particle" }));
  expect(risk.level).toBe("red");

  it("EARTH_GUIDED on Moon", () => {
    const moon = DELAY_PRESETS.find((p) => p.id === "moon")!;
    const t = triage(risk, "Radiation", moon.oneWaySeconds, false);
    // SPE timeToAct is 3 min; moon RT is 2.6 s — still EARTH_GUIDED unless forced
    expect(t.mode).toBe("EARTH_GUIDED");
    expect(t.headline).toContain("Contact Earth");
  });

  it("CREW_LED on Mars far", () => {
    const far = DELAY_PRESETS.find((p) => p.id === "mars-far")!;
    const t = triage(risk, "Radiation", far.oneWaySeconds, false);
    // 3 min time-to-act < 44 min RT → at least CREW_LED (forced from EARTH would apply;
    // Mars far is already CREW_LED by delay)
    expect(t.mode).toBe("CREW_LED");
    expect(t.headline).toContain("what to do now");
  });

  it("FULL_AUTONOMY on Deep space", () => {
    const deep = DELAY_PRESETS.find((p) => p.id === "deep-space")!;
    const t = triage(risk, "Radiation", deep.oneWaySeconds, false);
    expect(t.mode).toBe("FULL_AUTONOMY");
    expect(t.headline.toLowerCase()).toContain("on your own");
  });
});
