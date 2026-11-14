/** Phase 0 smoke: delay formatting helpers. */
import { describe, expect, it } from "vitest";
import { formatDelay, roundTrip, DELAY_PRESETS } from "@/lib/delay";

describe("delay helpers", () => {
  it("formats seconds, minutes, and hours", () => {
    expect(formatDelay(1.3)).toBe("1.3 s");
    expect(formatDelay(1320)).toBe("22 min");
    expect(formatDelay(15000)).toBe("4 h 10 min");
  });

  it("computes round trip", () => {
    expect(roundTrip(180)).toBe(360);
  });

  it("has five named presets", () => {
    expect(DELAY_PRESETS.map((p) => p.id)).toEqual([
      "iss",
      "moon",
      "mars-close",
      "mars-far",
      "deep-space",
    ]);
  });
});
