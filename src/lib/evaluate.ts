/**
 * Build ModuleState from mission inputs and evaluate all registered modules.
 */
import { generateDaySeries, generateMinuteVitals } from "./simulator";
import { MODULES } from "@/modules/registry";
import type { ModuleState } from "@/modules/types";
import type { PvtResult, RiskResult, ScenarioId, SelfReport } from "./types";

export type EvalInput = {
  seed: number;
  missionId: string;
  scenario: ScenarioId;
  missionDay: number;
  minuteOfDay?: number;
  selfReports?: SelfReport[];
  pvtResults?: PvtResult[];
};

export type ModuleRisk = {
  moduleId: string;
  name: string;
  bodyRegion: string;
  hazard: string;
  result: RiskResult;
};

export function buildModuleState(input: EvalInput): ModuleState {
  const minute = input.minuteOfDay ?? 60 * 10;
  const cfg = {
    seed: input.seed,
    missionId: input.missionId,
    scenario: input.scenario,
    missionDay: input.missionDay,
    selfReports: input.selfReports,
    pvtResults: input.pvtResults,
  };
  const daySeries = generateDaySeries(cfg, input.missionDay);
  const day = daySeries[daySeries.length - 1];
  const vitals = generateMinuteVitals(cfg, minute);
  const selfReport = input.selfReports?.find((r) => r.day === input.missionDay);
  const pvt = input.pvtResults?.find((r) => r.day === input.missionDay);
  return {
    missionId: input.missionId,
    missionDay: input.missionDay,
    vitals,
    day,
    daySeries,
    selfReport,
    pvt,
    scenario: input.scenario,
  };
}

export function evaluateAll(input: EvalInput): ModuleRisk[] {
  const state = buildModuleState(input);
  return MODULES.map((m) => ({
    moduleId: m.id,
    name: m.name,
    bodyRegion: m.bodyRegion,
    hazard: m.hazard,
    result: m.evaluate(state),
  }));
}

export function worstLevel(levels: Array<"green" | "amber" | "red">): "green" | "amber" | "red" {
  if (levels.includes("red")) return "red";
  if (levels.includes("amber")) return "amber";
  return "green";
}
