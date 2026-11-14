import { describe, expect, it } from "vitest";
import { analyzeJournal } from "@/lib/journal";

describe("journal lexicon", () => {
  it("flags isolation and stress keywords locally", () => {
    expect(analyzeJournal("Feeling lonely and stressed today")).toEqual(
      expect.arrayContaining(["isolation", "stress"])
    );
  });

  it("returns empty for neutral text", () => {
    expect(analyzeJournal("Completed exercise block")).toEqual([]);
  });
});
