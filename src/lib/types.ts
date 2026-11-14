/**
 * Shared domain types for simulator, modules, and store.
 */

export type ScenarioId =
  | "normal"
  | "poor-sleep"
  | "solar-particle"
  | "skipped-exercise"
  | "isolation-slump";

export type CrewMember = {
  id: string;
  firstName: string;
};

export type MinuteVitals = {
  minute: number;
  hr: number;
  bpSys: number;
  bpDia: number;
  spo2: number;
  respRate: number;
  skinTempC: number;
  activity: number;
};

export type DayMetrics = {
  day: number;
  sleepHours: number;
  exerciseMinutes: number;
  cumulativeDoseMsv: number;
  boneDensityChangePct: number;
  mood: number;
  pvtMedianMs: number;
  pvtLapses: number;
};

export type SymptomId =
  | "headache"
  | "blurred-vision"
  | "nausea"
  | "back-pain"
  | "congestion"
  | "rash";

export type SelfReport = {
  day: number;
  sleepHours: number;
  mood: number;
  symptoms: SymptomId[];
  exerciseMinutes: number;
  journal?: string;
  journalFlags?: string[];
  shareJournal?: boolean;
  visionGridOk?: boolean;
};

export type PvtResult = {
  day: number;
  medianMs: number;
  meanMs: number;
  lapses: number;
  falseStarts: number;
  samples: number[];
  demo: boolean;
};

export type AlertRecord = {
  id: string;
  moduleId: string;
  level: "green" | "amber" | "red";
  createdAtDay: number;
  headline: string;
};

export type CommsPacket = {
  id: string;
  createdAtMs: number;
  deliverAtMs: number;
  summary: string;
  reply?: string;
  delivered: boolean;
  queuedUntilLink: boolean;
};

export type RiskLevel = "green" | "amber" | "red";

export type Step = {
  id: string;
  text: string;
  minutes?: number;
};

export type Countermeasure = {
  id: string;
  name: string;
  detail: string;
};

export type RiskResult = {
  level: RiskLevel;
  score: number;
  reasons: string[];
  evidenceIds: string[];
  protocol: Step[];
  countermeasures: Countermeasure[];
  timeToActMinutes: number;
};

export type BodyRegion =
  | "head"
  | "eyes"
  | "chest"
  | "lungs"
  | "spine"
  | "hips"
  | "legs"
  | "skin"
  | "mind";

export type HazardCode = "R" | "I" | "D" | "G" | "E";
