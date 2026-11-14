/**
 * HealthModule contract — one file per domain; register in registry.ts.
 */
import type {
  BodyRegion,
  DayMetrics,
  HazardCode,
  MinuteVitals,
  PvtResult,
  RiskResult,
  SelfReport,
} from "@/lib/types";

export type ModuleState = {
  missionId: string;
  missionDay: number;
  vitals: MinuteVitals;
  day: DayMetrics;
  daySeries: DayMetrics[];
  selfReport?: SelfReport;
  pvt?: PvtResult;
  scenario: string;
};

export type HealthModule = {
  id: string;
  name: string;
  hazard: HazardCode;
  bodyRegion: BodyRegion;
  indicators: string[];
  evaluate: (state: ModuleState) => RiskResult;
};
