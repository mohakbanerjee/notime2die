/**
 * IndicatorDeepDive — Recharts history with threshold bands + what you can do.
 */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { useMissionStore } from "@/lib/store";
import { evaluateAll } from "@/lib/evaluate";
import { generateDaySeries } from "@/lib/simulator";
import { triage } from "@/lib/triage";
import { explainRisk } from "@/lib/explain";
import { getModule } from "@/modules/registry";
import { Panel } from "./Panel";
import { StatusPill } from "./StatusPill";
import { EvidenceLinks } from "./EvidenceLinks";

export function IndicatorDeepDive({ moduleId }: { moduleId: string }) {
  const store = useMissionStore();
  const mod = getModule(moduleId);
  const oneWay = store.oneWaySeconds();

  if (!mod) {
    return <p className="p-4">Unknown indicator: {moduleId}</p>;
  }

  const series = generateDaySeries(
    {
      seed: store.seed,
      missionId: store.missionId,
      scenario: store.scenario,
      missionDay: store.missionDay,
      selfReports: store.selfReports,
      pvtResults: store.pvtResults,
    },
    store.missionDay
  );

  const risks = evaluateAll({
    seed: store.seed,
    missionId: store.missionId,
    scenario: store.scenario,
    missionDay: store.missionDay,
    selfReports: store.selfReports,
    pvtResults: store.pvtResults,
  });
  const risk = risks.find((r) => r.moduleId === moduleId)!;
  const t = triage(risk.result, risk.name, oneWay, store.blackout);
  const expl = explainRisk(risk.result, t.mode, oneWay, store.blackout);

  const chartData = series.map((d) => {
    let value = d.sleepHours;
    if (moduleId === "radiation") value = d.cumulativeDoseMsv;
    else if (moduleId === "bone_muscle") value = d.boneDensityChangePct;
    else if (moduleId === "sleep_fatigue") value = d.sleepHours;
    else if (moduleId === "behavioral") value = d.mood;
    else if (moduleId === "cardiovascular") value = d.pvtMedianMs;
    else if (moduleId === "vision_SANS") value = d.mood;
    else if (moduleId === "immune") value = d.sleepHours;
    return { day: d.day, value };
  });

  const yLabel =
    moduleId === "radiation"
      ? "mSv"
      : moduleId === "bone_muscle"
        ? "% BMD"
        : moduleId === "behavioral"
          ? "mood"
          : moduleId === "cardiovascular"
            ? "ms"
            : "hours";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="m-0 font-[family-name:var(--font-jetbrains)] text-xl tracking-widest text-[var(--border-cyan)] uppercase">
          {mod.name}
        </h1>
        <StatusPill level={risk.result.level} />
        <span className="label-caps">Hazard {mod.hazard}</span>
      </div>

      <Panel title="Mission-day trend">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              {moduleId === "radiation" ? (
                <>
                  <ReferenceArea y1={0} y2={150} fill="rgba(46,229,155,0.08)" />
                  <ReferenceArea y1={150} y2={300} fill="rgba(245,185,66,0.08)" />
                  <ReferenceArea y1={300} y2={600} fill="rgba(255,77,109,0.08)" />
                  <ReferenceLine
                    y={600}
                    stroke="var(--status-red)"
                    label={{ value: "career-dose-limit", fill: "var(--text-dim)", fontSize: 10 }}
                  />
                </>
              ) : null}
              {moduleId === "sleep_fatigue" ? (
                <ReferenceLine
                  y={6.09}
                  stroke="var(--status-amber)"
                  label={{ value: "iss-sleep-avg", fill: "var(--text-dim)", fontSize: 10 }}
                />
              ) : null}
              <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={11} />
              <YAxis stroke="var(--text-dim)" fontSize={11} unit={` ${yLabel}`} width={56} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-panel)",
                  border: "1px solid var(--border-dim)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--border-cyan)"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel title="Why am I seeing this">
          <ul className="m-0 list-disc space-y-1 pl-4 text-sm">
            {expl.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--text-dim)]">{expl.autonomyText}</p>
          <div className="mt-3">
            <EvidenceLinks ids={risk.result.evidenceIds} />
          </div>
        </Panel>
        <Panel title="What you can do">
          <p className="mt-0 text-sm font-medium">{t.headline}</p>
          <ol className="list-decimal space-y-1 pl-4 text-sm">
            {t.steps.map((s) => (
              <li key={s.id}>{s.text}</li>
            ))}
          </ol>
          <div className="mt-3 space-y-2">
            {risk.result.countermeasures.map((c) => (
              <div key={c.id} className="border border-[var(--border-dim)] p-2">
                <div className="label-caps text-[var(--border-cyan)]">{c.name}</div>
                <div className="text-sm text-[var(--text-dim)]">{c.detail}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
