/**
 * PvtTest — Psychomotor Vigilance style reaction test (3 min or 30 s demo).
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMissionStore } from "@/lib/store";
import { Panel } from "./Panel";

type Phase = "idle" | "wait" | "stimulus" | "done";

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

export function PvtTest() {
  const store = useMissionStore();
  const [demo, setDemo] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [samples, setSamples] = useState<number[]>([]);
  const [lapses, setLapses] = useState(0);
  const [falseStarts, setFalseStarts] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const stimulusAt = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endAt = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
  };

  const scheduleStimulus = useCallback(() => {
    const delay = 2000 + Math.random() * 8000;
    setPhase("wait");
    timerRef.current = setTimeout(() => {
      stimulusAt.current = performance.now();
      setPhase("stimulus");
    }, delay);
  }, []);

  const finish = useCallback(
    (finalSamples: number[], finalLapses: number, finalFalse: number, isDemo: boolean) => {
      clearTimers();
      setPhase("done");
      store.addPvtResult({
        day: store.missionDay,
        medianMs: median(finalSamples),
        meanMs: finalSamples.length
          ? Math.round(finalSamples.reduce((a, b) => a + b, 0) / finalSamples.length)
          : 0,
        lapses: finalLapses,
        falseStarts: finalFalse,
        samples: finalSamples,
        demo: isDemo,
      });
    },
    [store]
  );

  function start(isDemo: boolean) {
    clearTimers();
    setDemo(isDemo);
    setSamples([]);
    setLapses(0);
    setFalseStarts(0);
    const duration = isDemo ? 30_000 : 180_000;
    endAt.current = performance.now() + duration;
    setRemainingMs(duration);
    tickRef.current = setInterval(() => {
      const left = Math.max(0, endAt.current - performance.now());
      setRemainingMs(left);
      if (left <= 0) {
        // finish with latest state via functional updates in click handler path —
        // here we read refs by finishing after timeout using setState callback pattern
      }
    }, 200);
    timerRef.current = setTimeout(() => {
      setSamples((s) => {
        setLapses((l) => {
          setFalseStarts((f) => {
            finish(s, l, f, isDemo);
            return f;
          });
          return l;
        });
        return s;
      });
    }, duration);
    scheduleStimulus();
  }

  useEffect(() => () => clearTimers(), []);

  function onTap() {
    if (phase === "wait") {
      setFalseStarts((f) => f + 1);
      if (timerRef.current) clearTimeout(timerRef.current);
      scheduleStimulus();
      return;
    }
    if (phase === "stimulus") {
      const rt = Math.round(performance.now() - stimulusAt.current);
      setSamples((s) => [...s, rt]);
      if (rt > 500) setLapses((l) => l + 1);
      if (performance.now() >= endAt.current) {
        setSamples((s) => {
          const next = [...s];
          setLapses((l) => {
            const nextL = rt > 500 ? l : l; // already counted
            setFalseStarts((f) => {
              finish(next, nextL, f, demo);
              return f;
            });
            return nextL;
          });
          return next;
        });
      } else {
        scheduleStimulus();
      }
    }
  }

  const med = median(samples);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3 p-4">
      <h1 className="m-0 font-[family-name:var(--font-jetbrains)] tracking-widest text-[var(--border-cyan)] uppercase">
        PVT
      </h1>
      <p className="m-0 text-sm text-[var(--text-dim)]">
        Psychomotor Vigilance style test · random 2–10 s delays · lapses &gt; 500 ms
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => start(true)}
          className="cursor-pointer border border-[var(--border-cyan)] bg-[var(--border-cyan)]/10 px-3 py-2 text-sm text-[var(--border-cyan)]"
        >
          30 s demo
        </button>
        <button
          type="button"
          onClick={() => start(false)}
          className="cursor-pointer border border-[var(--border-dim)] bg-transparent px-3 py-2 text-sm text-[var(--text)]"
        >
          Full 3 min
        </button>
      </div>

      <button
        type="button"
        onClick={onTap}
        disabled={phase === "idle" || phase === "done"}
        className={`flex h-56 w-full cursor-pointer items-center justify-center border text-xl tracking-widest ${
          phase === "stimulus"
            ? "border-[var(--status-green)] bg-[var(--status-green)]/30 text-[var(--status-green)]"
            : "border-[var(--border-dim)] bg-[var(--bg-panel)] text-[var(--text-dim)]"
        }`}
        aria-label="PVT response area"
      >
        {phase === "idle" && "START A RUN"}
        {phase === "wait" && "WAIT…"}
        {phase === "stimulus" && "TAP!"}
        {phase === "done" && "DONE"}
      </button>

      <Panel title="Live stats">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="label-caps">Remaining</div>
            <div className="num">{(remainingMs / 1000).toFixed(0)} s</div>
          </div>
          <div>
            <div className="label-caps">Samples</div>
            <div className="num">{samples.length}</div>
          </div>
          <div>
            <div className="label-caps">Median</div>
            <div className="num">{med || "—"} ms</div>
          </div>
          <div>
            <div className="label-caps">Lapses / false</div>
            <div className="num">
              {lapses} / {falseStarts}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
