/**
 * DemoRunner — plays the 30s wow-moment script; safe for screen recording.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useMissionStore } from "@/lib/store";
import { DEMO_STEPS } from "@/lib/demoScript";
import { isEnabled } from "@/lib/flags";

export function DemoRunner() {
  const store = useMissionStore();
  const [narration, setNarration] = useState("");
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  if (!isEnabled("demoMode")) return null;

  function stop() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    store.setDemoPlaying(false);
    setProgress(0);
  }

  function play() {
    stop();
    store.setDemoPlaying(true);
    const start = Date.now();
    const api = {
      reset: () => store.resetDemoState(),
      setMission: store.setMission,
      setDelayPreset: store.setDelayPreset,
      setBlackout: store.setBlackout,
      setMissionDay: store.setMissionDay,
      setScenario: store.setScenario,
      addSelfReport: store.addSelfReport,
      addPvt: store.addPvtResult,
      setNarration,
    };

    for (const step of DEMO_STEPS) {
      timers.current.push(
        setTimeout(() => {
          step.run(api);
          setProgress(step.atMs);
          if (step.label === "Done") {
            store.setDemoPlaying(false);
            if (tickRef.current) clearInterval(tickRef.current);
          }
        }, step.atMs)
      );
    }

    tickRef.current = setInterval(() => {
      setProgress(Math.min(30000, Date.now() - start));
    }, 100);
  }

  return (
    <div className="flex flex-col gap-2 border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={play}
          disabled={store.demoPlaying}
          className="cursor-pointer border border-[var(--border-cyan)] bg-[var(--border-cyan)]/15 px-3 py-2 text-sm tracking-wider text-[var(--border-cyan)] uppercase disabled:opacity-50"
        >
          Run demo
        </button>
        {store.demoPlaying ? (
          <button
            type="button"
            onClick={stop}
            className="cursor-pointer border border-[var(--status-red)] bg-transparent px-3 py-2 text-sm text-[var(--status-red)]"
          >
            Stop
          </button>
        ) : null}
        <span className="num text-xs text-[var(--text-dim)]">
          {(progress / 1000).toFixed(1)}s / 30s
        </span>
      </div>
      {narration ? (
        <p className="m-0 text-sm text-[var(--text)]" aria-live="polite">
          {narration}
        </p>
      ) : (
        <p className="m-0 text-xs text-[var(--text-dim)]">
          Plays the Moon → SEP → delay wow → bone → fatigue story for recording.
        </p>
      )}
      <div className="h-1 w-full bg-[var(--bg-deep)]">
        <div
          className="h-full bg-[var(--border-cyan)] transition-[width] duration-100"
          style={{ width: `${(progress / 30000) * 100}%` }}
        />
      </div>
    </div>
  );
}
