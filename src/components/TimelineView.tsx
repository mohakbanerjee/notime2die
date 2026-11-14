/**
 * TimelineView — mission day scrubber with body map, dose, bone, sleep/PVT, DONKI overlays.
 */
"use client";

import { useMemo } from "react";
import { useMissionStore } from "@/lib/store";
import { evaluateAll, worstLevel } from "@/lib/evaluate";
import { generateDaySeries } from "@/lib/simulator";
import { getDonkiEvents, eventDate } from "@/lib/donki";
import { getMission } from "@/lib/missions";
import { isEnabled } from "@/lib/flags";
import { Panel } from "./Panel";
import { BodyMap, type RegionLevels } from "./BodyMap";
import { Gauge } from "./Gauge";
import { Sparkline } from "./Sparkline";
import { DemoRunner } from "./DemoRunner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const STATUS_VAR = {
  green: "var(--status-green)",
  amber: "var(--status-amber)",
  red: "var(--status-red)",
} as const;

export function TimelineView() {
  const store = useMissionStore();
  const mission = getMission(store.missionId);
  const maxDay = Math.min(mission.missionLengthDays, 200);

  const series = useMemo(
    () =>
      generateDaySeries(
        {
          seed: store.seed,
          missionId: store.missionId,
          scenario: store.scenario,
          missionDay: store.missionDay,
          selfReports: store.selfReports,
          pvtResults: store.pvtResults,
        },
        store.missionDay
      ),
    [store]
  );

  const risks = useMemo(
    () =>
      evaluateAll({
        seed: store.seed,
        missionId: store.missionId,
        scenario: store.scenario,
        missionDay: store.missionDay,
        selfReports: store.selfReports,
        pvtResults: store.pvtResults,
      }),
    [store]
  );

  const regionLevels: RegionLevels = useMemo(() => {
    const map: RegionLevels = {};
    for (const r of risks) {
      const prev = map[r.bodyRegion] ?? "green";
      map[r.bodyRegion] = worstLevel([prev, r.result.level]);
    }
    return map;
  }, [risks]);

  const day = series[series.length - 1];
  const doseLevel =
    day.cumulativeDoseMsv >= 300 ? "red" : day.cumulativeDoseMsv >= 150 ? "amber" : "green";
  const boneLevel =
    day.boneDensityChangePct <= -4 ? "red" : day.boneDensityChangePct <= -1.5 ? "amber" : "green";

  const donki = useMemo(() => {
    if (!isEnabled("donkiOverlay")) return [];
    return getDonkiEvents()
      .map((ev) => eventDate(ev))
      .filter((d): d is string => Boolean(d))
      .slice(0, 12);
  }, []);

  const chartData = series.map((d) => ({
    day: d.day,
    sleep: d.sleepHours,
    pvt: d.pvtMedianMs,
    dose: d.cumulativeDoseMsv,
    bone: d.boneDensityChangePct,
    exercise: d.exerciseMinutes,
  }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 p-4">
      <h1 className="m-0 font-[family-name:var(--font-jetbrains)] tracking-widest text-[var(--border-cyan)] uppercase">
        Mission timeline
      </h1>

      <DemoRunner />

      <Panel title="Day scrubber">
        <input
          type="range"
          min={1}
          max={maxDay}
          value={store.missionDay}
          onChange={(e) => store.setMissionDay(Number(e.target.value))}
          className="w-full accent-[var(--border-cyan)]"
          aria-label="Mission day"
        />
        <div className="num text-lg">
          Day {store.missionDay} / {mission.missionLengthDays}
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-[220px_1fr]">
        <Panel title="Body map @ day">
          <BodyMap
            levels={regionLevels}
            selected={store.selectedRegion}
            onSelect={(r) => store.setSelectedRegion(r)}
          />
        </Panel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel title="Cumulative dose vs 600 mSv">
            <div className="flex justify-center">
              <Gauge
                value={day.cumulativeDoseMsv}
                max={600}
                label="Career ref"
                unit="mSv"
                level={doseLevel}
              />
            </div>
          </Panel>
          <Panel title="Bone density projection">
            <div className="flex flex-col items-center gap-2">
              <div className="num text-3xl" style={{ color: STATUS_VAR[boneLevel] }}>
                {day.boneDensityChangePct.toFixed(2)}%
              </div>
              <Sparkline
                data={series.map((d) => d.boneDensityChangePct)}
                width={180}
                height={40}
                color={STATUS_VAR[boneLevel]}
              />
              <p className="m-0 text-xs text-[var(--text-dim)]">
                vs exercise adherence (today {day.exerciseMinutes} min)
              </p>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Sleep & PVT trends">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={11} />
              <YAxis yAxisId="l" stroke="var(--text-dim)" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="var(--text-dim)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-panel)",
                  border: "1px solid var(--border-dim)",
                }}
              />
              <ReferenceLine
                yAxisId="l"
                y={6.09}
                stroke="var(--status-amber)"
                strokeDasharray="4 4"
              />
              <Line
                yAxisId="l"
                type="monotone"
                dataKey="sleep"
                stroke="var(--border-cyan)"
                dot={false}
                name="Sleep h"
              />
              <Line
                yAxisId="r"
                type="monotone"
                dataKey="pvt"
                stroke="var(--status-amber)"
                dot={false}
                name="PVT ms"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="DONKI SEP overlays">
        {donki.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)]">
            No cached SEP dates — run <code>npm run fetch:donki</code>.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {donki.map((d) => (
              <li
                key={d}
                className="border border-[var(--status-amber)]/40 px-2 py-1 text-xs text-[var(--status-amber)]"
              >
                real NASA DONKI event, date {d}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
