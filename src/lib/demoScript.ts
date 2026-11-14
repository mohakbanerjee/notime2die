/**
 * Scripted ~30s demo for screen recording (1920×1080 friendly).
 * Steps mutate the zustand store via callbacks.
 */
export type DemoStep = {
  atMs: number;
  label: string;
  run: (api: DemoApi) => void;
};

export type DemoApi = {
  reset: () => void;
  setMission: (id: string) => void;
  setDelayPreset: (id: string) => void;
  setBlackout: (v: boolean) => void;
  setMissionDay: (d: number) => void;
  setScenario: (s: "normal" | "poor-sleep" | "solar-particle" | "skipped-exercise" | "isolation-slump") => void;
  addSelfReport: (r: {
    day: number;
    sleepHours: number;
    mood: number;
    symptoms: [];
    exerciseMinutes: number;
  }) => void;
  addPvt: (r: {
    day: number;
    medianMs: number;
    meanMs: number;
    lapses: number;
    falseStarts: number;
    samples: number[];
    demo: boolean;
  }) => void;
  setNarration: (text: string) => void;
};

export const DEMO_STEPS: DemoStep[] = [
  {
    atMs: 0,
    label: "Moon nominal",
    run: (api) => {
      api.reset();
      api.setMission("lunar-gateway");
      api.setDelayPreset("moon");
      api.setScenario("normal");
      api.setMissionDay(12);
      api.setNarration("Normal day on a Moon mission — all green.");
    },
  },
  {
    atMs: 4000,
    label: "SEP event",
    run: (api) => {
      api.setScenario("solar-particle");
      api.setNarration(
        "Real DONKI solar particle context — dose alert: Contact Earth, flight surgeon looped in."
      );
    },
  },
  {
    atMs: 8000,
    label: "Delay → Mars close",
    run: (api) => {
      api.setDelayPreset("mars-close");
      api.setNarration("WOW: delay slides out. Same alert → Here is what to do now (Mars close).");
    },
  },
  {
    atMs: 12000,
    label: "Delay → Mars far",
    run: (api) => {
      api.setDelayPreset("mars-far");
      api.setNarration("Mars far — crew steps + summary home, reply ETA ~44 min.");
    },
  },
  {
    atMs: 16000,
    label: "Delay → Deep space",
    run: (api) => {
      api.setDelayPreset("deep-space");
      api.setNarration("Deep space — Full autonomy: log sent later.");
    },
  },
  {
    atMs: 20000,
    label: "Bone projection",
    run: (api) => {
      api.setMission("mars-transit");
      api.setDelayPreset("mars-far");
      api.setScenario("skipped-exercise");
      api.setMissionDay(120);
      api.setNarration("Fast forward 120 days: skipped exercise turns hips amber.");
    },
  },
  {
    atMs: 25000,
    label: "Fatigue plan",
    run: (api) => {
      api.setScenario("poor-sleep");
      api.setMissionDay(121);
      api.addSelfReport({
        day: 121,
        sleepHours: 4.5,
        mood: 2.5,
        symptoms: [],
        exerciseMinutes: 20,
      });
      api.addPvt({
        day: 121,
        medianMs: 420,
        meanMs: 430,
        lapses: 5,
        falseStarts: 1,
        samples: [410, 450, 390, 500, 440],
        demo: true,
      });
      api.setNarration("Check-in + PVT show fatigue — rest plan before a risky task.");
    },
  },
  {
    atMs: 30000,
    label: "Done",
    run: (api) => {
      api.setNarration("Demo complete. Scrub the timeline or tweak the delay dial.");
    },
  },
];
