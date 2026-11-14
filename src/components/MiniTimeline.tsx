/**
 * MiniTimeline — last 14 mission days strip on the Bridge.
 */
"use client";

import { generateDaySeries } from "@/lib/simulator";
import type { ScenarioId } from "@/lib/types";

type MiniTimelineProps = {
  seed: number;
  missionId: string;
  scenario: ScenarioId;
  missionDay: number;
  onSelectDay: (day: number) => void;
};

export function MiniTimeline({
  seed,
  missionId,
  scenario,
  missionDay,
  onSelectDay,
}: MiniTimelineProps) {
  const from = Math.max(1, missionDay - 13);
  const series = generateDaySeries(
    { seed, missionId, scenario, missionDay },
    missionDay
  ).filter((d) => d.day >= from);

  const maxDose = Math.max(...series.map((d) => d.cumulativeDoseMsv), 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="label-caps">Last 14 mission days</div>
      <div className="flex items-end gap-1 overflow-x-auto pb-1">
        {series.map((d) => {
          const h = Math.max(8, (d.cumulativeDoseMsv / maxDose) * 48);
          const active = d.day === missionDay;
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => onSelectDay(d.day)}
              className={`flex w-7 flex-col items-center gap-1 border-0 bg-transparent p-0 ${
                active ? "opacity-100" : "opacity-70"
              }`}
              aria-label={`Mission day ${d.day}`}
            >
              <span
                className="w-full rounded-sm"
                style={{
                  height: h,
                  background: active ? "var(--border-cyan)" : "rgba(30,230,255,0.35)",
                }}
              />
              <span className="num text-[0.6rem] text-[var(--text-dim)]">{d.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
