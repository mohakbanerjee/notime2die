/**
 * CheckinForm — daily self-report in under ~90 seconds.
 */
"use client";

import { useState } from "react";
import { useMissionStore } from "@/lib/store";
import { analyzeJournal } from "@/lib/journal";
import type { SymptomId } from "@/lib/types";
import { Panel } from "./Panel";

const SYMPTOMS: { id: SymptomId; label: string }[] = [
  { id: "headache", label: "Headache" },
  { id: "blurred-vision", label: "Blurred vision" },
  { id: "nausea", label: "Nausea" },
  { id: "back-pain", label: "Back pain" },
  { id: "congestion", label: "Congestion" },
  { id: "rash", label: "Rash" },
];

export function CheckinForm() {
  const store = useMissionStore();
  const existing = store.selfReports.find((r) => r.day === store.missionDay);
  const [sleep, setSleep] = useState(existing?.sleepHours ?? 6.5);
  const [mood, setMood] = useState(existing?.mood ?? 3);
  const [symptoms, setSymptoms] = useState<SymptomId[]>(existing?.symptoms ?? []);
  const [exercise, setExercise] = useState(existing?.exerciseMinutes ?? 45);
  const [journal, setJournal] = useState(existing?.journal ?? "");
  const [share, setShare] = useState(existing?.shareJournal ?? false);
  const [gridOk, setGridOk] = useState(existing?.visionGridOk ?? true);
  const [saved, setSaved] = useState(false);

  function toggle(id: SymptomId) {
    setSymptoms((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const flags = journal.trim() ? analyzeJournal(journal) : [];
    store.addSelfReport({
      day: store.missionDay,
      sleepHours: sleep,
      mood,
      symptoms,
      exerciseMinutes: exercise,
      journal: journal.trim() || undefined,
      journalFlags: flags,
      shareJournal: share,
      visionGridOk: gridOk,
    });
    setSaved(true);
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-xl flex-col gap-3 p-4">
      <h1 className="m-0 font-[family-name:var(--font-jetbrains)] tracking-widest text-[var(--border-cyan)] uppercase">
        Daily check-in
      </h1>
      <p className="m-0 text-sm text-[var(--text-dim)]">
        Mission day {store.missionDay} · aim for under 90 seconds
      </p>

      <Panel title="Sleep hours">
        <input
          type="range"
          min={3}
          max={10}
          step={0.1}
          value={sleep}
          onChange={(e) => setSleep(Number(e.target.value))}
          className="w-full accent-[var(--border-cyan)]"
        />
        <div className="num text-xl">{sleep.toFixed(1)} h</div>
      </Panel>

      <Panel title="Mood">
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full accent-[var(--border-cyan)]"
        />
        <div className="num text-xl">{mood} / 5</div>
      </Panel>

      <Panel title="Symptoms">
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => {
            const on = symptoms.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`label-caps cursor-pointer border px-2 py-1 ${
                  on
                    ? "border-[var(--status-amber)] text-[var(--status-amber)]"
                    : "border-[var(--border-dim)] text-[var(--text-dim)] bg-transparent"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Exercise minutes">
        <input
          type="number"
          min={0}
          max={180}
          value={exercise}
          onChange={(e) => setExercise(Number(e.target.value))}
          className="num w-24 border border-[var(--border-dim)] bg-[var(--bg-deep)] px-2 py-1 text-[var(--text)]"
        />
      </Panel>

      <Panel title="Vision grid (self test)">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={gridOk}
            onChange={(e) => setGridOk(e.target.checked)}
          />
          Grid looks normal (no distortion)
        </label>
      </Panel>

      <Panel title="Optional journal">
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          rows={3}
          className="w-full border border-[var(--border-dim)] bg-[var(--bg-deep)] p-2 text-sm text-[var(--text)]"
          placeholder="Private notes…"
        />
        <p className="mt-1 text-xs text-[var(--status-amber)]">
          private: stays on this device unless you choose to share
        </p>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} />
          Share a summary with ground packet
        </label>
      </Panel>

      <button
        type="submit"
        className="cursor-pointer border border-[var(--border-cyan)] bg-[var(--border-cyan)]/15 px-4 py-2 text-[var(--border-cyan)]"
      >
        Save check-in
      </button>
      {saved ? (
        <p className="text-sm text-[var(--status-green)]">Saved for day {store.missionDay}.</p>
      ) : null}
    </form>
  );
}
