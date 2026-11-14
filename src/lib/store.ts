/**
 * Zustand mission store — single source of truth for delay, mission, scenario, crew, inputs.
 */
"use client";

import { create } from "zustand";
import { getMission } from "./missions";
import { resolveOneWaySeconds } from "./delay";
import { getAutonomyMode } from "./autonomy";
import type {
  AlertRecord,
  CommsPacket,
  CrewMember,
  PvtResult,
  ScenarioId,
  SelfReport,
} from "./types";

export const CREW: CrewMember[] = [
  { id: "crew-a", firstName: "Alex" },
  { id: "crew-b", firstName: "Jordan" },
  { id: "crew-c", firstName: "Sam" },
];

type MissionState = {
  missionId: string;
  delayPresetId: string;
  customDelaySeconds: number;
  blackout: boolean;
  missionDay: number;
  scenario: ScenarioId;
  crewId: string;
  seed: number;
  selfReports: SelfReport[];
  pvtResults: PvtResult[];
  alerts: AlertRecord[];
  commsQueue: CommsPacket[];
  demoPlaying: boolean;
  selectedRegion: string | null;
  selectedModuleId: string | null;

  oneWaySeconds: () => number;
  autonomyMode: () => ReturnType<typeof getAutonomyMode>;

  setMission: (id: string) => void;
  setDelayPreset: (id: string) => void;
  setCustomDelay: (seconds: number) => void;
  setBlackout: (v: boolean) => void;
  setMissionDay: (day: number) => void;
  setScenario: (s: ScenarioId) => void;
  setCrew: (id: string) => void;
  addSelfReport: (r: SelfReport) => void;
  addPvtResult: (r: PvtResult) => void;
  setAlerts: (a: AlertRecord[]) => void;
  enqueueComms: (p: Omit<CommsPacket, "id" | "delivered"> & { id?: string }) => void;
  markCommsDelivered: (id: string, reply: string) => void;
  setDemoPlaying: (v: boolean) => void;
  setSelectedRegion: (r: string | null) => void;
  setSelectedModuleId: (id: string | null) => void;
  resetDemoState: () => void;
};

const initialMission = getMission("lunar-gateway");

export const useMissionStore = create<MissionState>((set, get) => ({
  missionId: initialMission.id,
  delayPresetId: initialMission.defaultDelayPresetId,
  customDelaySeconds: 60,
  blackout: false,
  missionDay: 12,
  scenario: "normal",
  crewId: CREW[0].id,
  seed: 42,
  selfReports: [],
  pvtResults: [],
  alerts: [],
  commsQueue: [],
  demoPlaying: false,
  selectedRegion: null,
  selectedModuleId: null,

  oneWaySeconds: () => resolveOneWaySeconds(get().delayPresetId, get().customDelaySeconds),
  autonomyMode: () => getAutonomyMode(get().oneWaySeconds(), get().blackout),

  setMission: (id) => {
    const m = getMission(id);
    set({
      missionId: id,
      delayPresetId: m.defaultDelayPresetId,
    });
  },
  setDelayPreset: (id) => set({ delayPresetId: id }),
  setCustomDelay: (seconds) => set({ customDelaySeconds: seconds, delayPresetId: "custom" }),
  setBlackout: (v) => set({ blackout: v }),
  setMissionDay: (day) => set({ missionDay: Math.max(1, day) }),
  setScenario: (s) => set({ scenario: s }),
  setCrew: (id) => set({ crewId: id }),
  addSelfReport: (r) =>
    set((st) => ({
      selfReports: [...st.selfReports.filter((x) => x.day !== r.day), r],
    })),
  addPvtResult: (r) =>
    set((st) => ({
      pvtResults: [...st.pvtResults.filter((x) => x.day !== r.day), r],
    })),
  setAlerts: (a) => set({ alerts: a }),
  enqueueComms: (p) =>
    set((st) => ({
      commsQueue: [
        ...st.commsQueue,
        {
          id: p.id ?? `pkt-${Date.now()}-${st.commsQueue.length}`,
          createdAtMs: p.createdAtMs,
          deliverAtMs: p.deliverAtMs,
          summary: p.summary,
          reply: p.reply,
          delivered: false,
          queuedUntilLink: p.queuedUntilLink,
        },
      ],
    })),
  markCommsDelivered: (id, reply) =>
    set((st) => ({
      commsQueue: st.commsQueue.map((c) =>
        c.id === id ? { ...c, delivered: true, reply } : c
      ),
    })),
  setDemoPlaying: (v) => set({ demoPlaying: v }),
  setSelectedRegion: (r) => set({ selectedRegion: r }),
  setSelectedModuleId: (id) => set({ selectedModuleId: id }),
  resetDemoState: () =>
    set({
      missionId: "lunar-gateway",
      delayPresetId: "moon",
      blackout: false,
      missionDay: 12,
      scenario: "normal",
      selfReports: [],
      pvtResults: [],
      alerts: [],
      commsQueue: [],
      demoPlaying: false,
    }),
}));
