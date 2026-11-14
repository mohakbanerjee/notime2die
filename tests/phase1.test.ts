/** Phase 1: simulator determinism, dose accumulation, autonomy modes. */
import { describe, expect, it } from "vitest";
import { generateDaySeries, generateMinuteVitals } from "@/lib/simulator";
import { getAutonomyMode } from "@/lib/autonomy";
import { DELAY_PRESETS } from "@/lib/delay";

describe("simulator", () => {
  it("is deterministic for the same seed", () => {
    const cfg = {
      seed: 42,
      missionId: "mars-transit",
      scenario: "normal" as const,
      missionDay: 10,
    };
    const a = generateMinuteVitals(cfg, 100);
    const b = generateMinuteVitals(cfg, 100);
    expect(a).toEqual(b);
    const d1 = generateDaySeries(cfg, 10);
    const d2 = generateDaySeries(cfg, 10);
    expect(d1).toEqual(d2);
  });

  it("accumulates dose across days", () => {
    const series = generateDaySeries(
      {
        seed: 7,
        missionId: "mars-transit",
        scenario: "normal",
        missionDay: 5,
      },
      5
    );
    expect(series[0].cumulativeDoseMsv).toBeGreaterThan(0);
    expect(series[4].cumulativeDoseMsv).toBeGreaterThan(series[0].cumulativeDoseMsv);
    // Mars cruise ~1.84 mSv/day
    expect(series[4].cumulativeDoseMsv).toBeCloseTo(1.84 * 5, 0);
  });
});

describe("getAutonomyMode", () => {
  it("returns EARTH_GUIDED for ISS and Moon", () => {
    const iss = DELAY_PRESETS.find((p) => p.id === "iss")!;
    const moon = DELAY_PRESETS.find((p) => p.id === "moon")!;
    expect(getAutonomyMode(iss.oneWaySeconds, false)).toBe("EARTH_GUIDED");
    expect(getAutonomyMode(moon.oneWaySeconds, false)).toBe("EARTH_GUIDED");
  });

  it("returns CREW_LED for Mars close and Mars far", () => {
    const close = DELAY_PRESETS.find((p) => p.id === "mars-close")!;
    const far = DELAY_PRESETS.find((p) => p.id === "mars-far")!;
    expect(getAutonomyMode(close.oneWaySeconds, false)).toBe("CREW_LED");
    expect(getAutonomyMode(far.oneWaySeconds, false)).toBe("CREW_LED");
  });

  it("returns FULL_AUTONOMY for Deep space and blackout", () => {
    const deep = DELAY_PRESETS.find((p) => p.id === "deep-space")!;
    expect(getAutonomyMode(deep.oneWaySeconds, false)).toBe("FULL_AUTONOMY");
    expect(getAutonomyMode(1, true)).toBe("FULL_AUTONOMY");
  });
});
