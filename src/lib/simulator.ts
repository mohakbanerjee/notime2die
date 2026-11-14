/**
 * Seeded deterministic health simulator.
 * Same seed + scenario + mission → same demo every time.
 */
import { getMission } from "./missions";
import type {
  DayMetrics,
  MinuteVitals,
  ScenarioId,
  SelfReport,
  PvtResult,
} from "./types";

/** Mulberry32 PRNG — tiny, deterministic. */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export type SimConfig = {
  seed: number;
  missionId: string;
  scenario: ScenarioId;
  missionDay: number;
  selfReports?: SelfReport[];
  pvtResults?: PvtResult[];
};

function scenarioMods(scenario: ScenarioId, day: number) {
  return {
    sleepDelta:
      scenario === "poor-sleep" && day % 7 < 5 ? -1.8 : scenario === "isolation-slump" ? -0.6 : 0,
    exerciseFactor: scenario === "skipped-exercise" ? 0.15 : 1,
    moodDelta: scenario === "isolation-slump" ? -1.2 : 0,
    speBoost: scenario === "solar-particle" ? 12 : 0, // mSv spike day event
    pvtDelta: scenario === "poor-sleep" ? 80 : scenario === "isolation-slump" ? 40 : 0,
  };
}

/** Per-minute vitals for the current mission day (1440 samples conceptually; we generate on demand). */
export function generateMinuteVitals(
  config: SimConfig,
  minuteOfDay: number
): MinuteVitals {
  const rng = createRng(config.seed + config.missionDay * 10007 + minuteOfDay);
  const mods = scenarioMods(config.scenario, config.missionDay);
  const activity = clamp(0.1 + rng() * 0.5 + (minuteOfDay % 180 < 40 ? 0.4 : 0), 0, 1);
  const hr = Math.round(62 + activity * 48 + (rng() - 0.5) * 6 + (mods.sleepDelta < -1 ? 6 : 0));
  const bpSys = Math.round(110 + activity * 18 + (rng() - 0.5) * 8);
  const bpDia = Math.round(70 + activity * 8 + (rng() - 0.5) * 5);
  const spo2 = clamp(97.5 + (rng() - 0.5) * 1.5 - (mods.sleepDelta < -1 ? 0.8 : 0), 90, 100);
  const respRate = Math.round(12 + activity * 8 + (rng() - 0.5) * 2);
  const skinTempC = clamp(36.4 + (rng() - 0.5) * 0.6 + (config.scenario === "isolation-slump" && dayFever(config) ? 0.9 : 0), 35.5, 39);

  return {
    minute: minuteOfDay,
    hr,
    bpSys,
    bpDia,
    spo2: Math.round(spo2 * 10) / 10,
    respRate,
    skinTempC: Math.round(skinTempC * 10) / 10,
    activity: Math.round(activity * 100) / 100,
  };
}

function dayFever(config: SimConfig): boolean {
  return config.missionDay % 23 === 0;
}

/** Build day metrics from day 1..throughDay inclusive. */
export function generateDaySeries(config: SimConfig, throughDay: number): DayMetrics[] {
  const mission = getMission(config.missionId);
  const days: DayMetrics[] = [];
  let cumulative = 0;
  let bone = 0;

  for (let day = 1; day <= throughDay; day++) {
    const rng = createRng(config.seed + day * 9973);
    const mods = scenarioMods(config.scenario, day);
    const report = config.selfReports?.find((r) => r.day === day);
    const pvt = config.pvtResults?.find((r) => r.day === day);

    let sleep = report?.sleepHours ?? clamp(6.09 + (rng() - 0.45) * 1.4 + mods.sleepDelta, 3.5, 9);
    let exercise =
      report?.exerciseMinutes ??
      Math.round(clamp(45 + (rng() - 0.5) * 30, 0, 90) * mods.exerciseFactor);
    let mood = report?.mood ?? clamp(3.2 + (rng() - 0.5) * 1.2 + mods.moodDelta, 1, 5);

    const dailyDose = mission.radiationDoseRateMsvPerDay + (day === Math.max(2, Math.floor(throughDay * 0.3)) ? mods.speBoost : 0);
    // SPE scenario: spike on a fixed day relative to current window
    const speDay = config.scenario === "solar-particle" ? Math.min(throughDay, Math.max(2, 5)) : -1;
    const doseToday =
      mission.radiationDoseRateMsvPerDay + (day === speDay ? mods.speBoost || 12 : 0);
    cumulative += doseToday;

    // Bone: ~1.25%/month without exercise; exercise reduces loss
    const monthFrac = 1 / 30;
    const baseLoss = 1.25 * monthFrac;
    const adherence = clamp(exercise / 60, 0, 1);
    bone -= baseLoss * (1 - adherence * 0.75);

    const pvtMedian =
      pvt?.medianMs ?? Math.round(240 + (rng() - 0.5) * 40 + mods.pvtDelta + (7 - sleep) * 15);
    const pvtLapses =
      pvt?.lapses ?? Math.max(0, Math.round((rng() * 3 + mods.pvtDelta / 40) * (sleep < 6 ? 1.5 : 1)));

    days.push({
      day,
      sleepHours: Math.round(sleep * 100) / 100,
      exerciseMinutes: exercise,
      cumulativeDoseMsv: Math.round(cumulative * 100) / 100,
      boneDensityChangePct: Math.round(bone * 100) / 100,
      mood: Math.round(mood * 10) / 10,
      pvtMedianMs: pvtMedian,
      pvtLapses,
    });

    void dailyDose;
  }
  return days;
}

export function getDayMetrics(config: SimConfig): DayMetrics {
  const series = generateDaySeries(config, config.missionDay);
  return series[series.length - 1];
}

/** Latest N minutes of vitals for live HUD (deterministic). */
export function recentVitals(config: SimConfig, count: number, endMinute: number): MinuteVitals[] {
  const out: MinuteVitals[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const m = ((endMinute - i) % 1440 + 1440) % 1440;
    out.push(generateMinuteVitals(config, m));
  }
  return out;
}
