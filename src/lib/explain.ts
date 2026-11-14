/**
 * Explainability — "why am I seeing this" from reasons + evidence + autonomy choice.
 */
import { getEvidence, type EvidenceEntry } from "./evidence";
import { autonomyReason, type AutonomyMode } from "./autonomy";
import type { RiskResult } from "./types";

export type Explanation = {
  summary: string;
  reasons: string[];
  evidence: EvidenceEntry[];
  autonomyText: string;
  demoAssumptions: string[];
};

export function explainRisk(
  risk: RiskResult,
  mode: AutonomyMode,
  oneWaySeconds: number,
  blackout: boolean
): Explanation {
  const evidence = risk.evidenceIds
    .map((id) => getEvidence(id))
    .filter((e): e is EvidenceEntry => Boolean(e));

  const demoAssumptions = evidence
    .filter((e) => e.demoAssumption)
    .map((e) => `${e.id}: ${e.meaning}`);

  return {
    summary:
      risk.reasons[0] ??
      "This alert was produced by an onboard health module using current vitals and mission settings.",
    reasons: risk.reasons,
    evidence,
    autonomyText: autonomyReason(mode, oneWaySeconds, blackout),
    demoAssumptions,
  };
}

export function evidenceCitation(entry: EvidenceEntry): string {
  if (entry.demoAssumption) return `${entry.id} — demo assumption`;
  return `${entry.sourceTitle}${entry.sourceUrl ? ` (${entry.sourceUrl})` : ""}`;
}
