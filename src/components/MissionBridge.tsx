/**
 * MissionBridge — main HUD: delay dial, vitals, body map, alerts, mini timeline.
 */
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMissionStore, CREW } from "@/lib/store";
import { MISSIONS, getMission } from "@/lib/missions";
import { formatDelay, roundTrip } from "@/lib/delay";
import { evaluateAll, worstLevel } from "@/lib/evaluate";
import { generateDaySeries } from "@/lib/simulator";
import { getModule } from "@/modules/registry";
import { Panel } from "./Panel";
import { DelayDial } from "./DelayDial";
import { AutonomyBadge } from "./AutonomyBadge";
import { VitalsLive } from "./VitalsLive";
import { BodyMap, type RegionLevels } from "./BodyMap";
import { AlertStack } from "./AlertStack";
import { MiniTimeline } from "./MiniTimeline";
import { ModuleDrawer } from "./ModuleDrawer";
import { DemoRunner } from "./DemoRunner";
import type { RiskLevel } from "@/lib/types";

export function MissionBridge() {
  const store = useMissionStore();
  const oneWay = store.oneWaySeconds();
  const mode = store.autonomyMode();
  const mission = getMission(store.missionId);

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
    [
      store.seed,
      store.missionId,
      store.scenario,
      store.missionDay,
      store.selfReports,
      store.pvtResults,
    ]
  );

  const regionLevels: RegionLevels = useMemo(() => {
    const map: RegionLevels = {};
    for (const r of risks) {
      const prev = map[r.bodyRegion] ?? "green";
      map[r.bodyRegion] = worstLevel([prev, r.result.level]);
    }
    return map;
  }, [risks]);

  const selectedModuleId =
    store.selectedModuleId ??
    (store.selectedRegion
      ? risks.find((r) => r.bodyRegion === store.selectedRegion)?.moduleId ?? null
      : null);

  const trend = useMemo(() => {
    if (!selectedModuleId) return [];
    const mod = getModule(selectedModuleId);
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
    if (!mod) return series.map((d) => d.sleepHours);
    if (mod.id === "radiation") return series.map((d) => d.cumulativeDoseMsv);
    if (mod.id === "bone_muscle") return series.map((d) => d.boneDensityChangePct);
    if (mod.id === "sleep_fatigue") return series.map((d) => d.sleepHours);
    if (mod.id === "behavioral") return series.map((d) => d.mood);
    if (mod.id === "cardiovascular") return series.map((d) => d.pvtMedianMs);
    return series.map((d) => d.sleepHours);
  }, [selectedModuleId, store]);

  function openRegion(region: string) {
    store.setSelectedRegion(region);
    const hit = risks.find((r) => r.bodyRegion === region);
    store.setSelectedModuleId(hit?.moduleId ?? null);
  }

  const worst: RiskLevel = worstLevel(risks.map((r) => r.result.level));

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-3 p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 border border-[var(--border-dim)] bg-[var(--bg-panel)] p-3"
      >
        <label className="flex items-center gap-2 text-sm">
          <span className="label-caps">Mission</span>
          <select
            value={store.missionId}
            onChange={(e) => store.setMission(e.target.value)}
            className="border border-[var(--border-dim)] bg-[var(--bg-deep)] px-2 py-1 text-[var(--text)]"
          >
            {MISSIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <div className="num text-sm">
          Day <span className="text-[var(--border-cyan)]">{store.missionDay}</span>
          <span className="text-[var(--text-dim)]"> / {mission.missionLengthDays}</span>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="label-caps">Crew</span>
          <select
            value={store.crewId}
            onChange={(e) => store.setCrew(e.target.value)}
            className="border border-[var(--border-dim)] bg-[var(--bg-deep)] px-2 py-1 text-[var(--text)]"
          >
            {CREW.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="label-caps">Scenario</span>
          <select
            value={store.scenario}
            onChange={(e) =>
              store.setScenario(e.target.value as typeof store.scenario)
            }
            className="border border-[var(--border-dim)] bg-[var(--bg-deep)] px-2 py-1 text-[var(--text)]"
          >
            <option value="normal">Normal</option>
            <option value="poor-sleep">Poor sleep week</option>
            <option value="solar-particle">Solar particle event</option>
            <option value="skipped-exercise">Skipped exercise</option>
            <option value="isolation-slump">Isolation slump</option>
          </select>
        </label>
        <AutonomyBadge mode={mode} />
        <span className="label-caps">
          Body map: {worst === "green" ? "NOMINAL" : worst.toUpperCase()}
        </span>
      </motion.div>

      <DemoRunner />

      <Panel title="Earth delay">
        <DelayDial
          presetId={store.delayPresetId}
          customSeconds={store.customDelaySeconds}
          blackout={store.blackout}
          oneWaySeconds={oneWay}
          onPreset={store.setDelayPreset}
          onCustom={store.setCustomDelay}
          onBlackout={store.setBlackout}
        />
        <p className="mt-2 text-sm text-[var(--text)]">
          {store.blackout ? (
            <>Earth: <span className="text-[var(--status-red)]">BLACKOUT</span> — no link</>
          ) : (
            <>
              Earth: <span className="num text-[var(--border-cyan)]">{formatDelay(oneWay)}</span> one
              way,{" "}
              <span className="num text-[var(--border-cyan)]">{formatDelay(roundTrip(oneWay))}</span>{" "}
              round trip
            </>
          )}
        </p>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr_320px]">
        <Panel title="Live vitals">
          <VitalsLive
            seed={store.seed}
            missionId={store.missionId}
            scenario={store.scenario}
            missionDay={store.missionDay}
          />
        </Panel>
        <Panel title="Body map">
          <BodyMap
            levels={regionLevels}
            selected={store.selectedRegion}
            onSelect={openRegion}
          />
        </Panel>
        <Panel title="Alert stack">
          <AlertStack
            risks={risks}
            oneWaySeconds={oneWay}
            blackout={store.blackout}
            onOpenModule={(id) => {
              store.setSelectedModuleId(id);
              const m = getModule(id);
              if (m) store.setSelectedRegion(m.bodyRegion);
            }}
          />
        </Panel>
      </div>

      <Panel title="Timeline">
        <MiniTimeline
          seed={store.seed}
          missionId={store.missionId}
          scenario={store.scenario}
          missionDay={store.missionDay}
          onSelectDay={store.setMissionDay}
        />
      </Panel>

      <ModuleDrawer
        moduleId={selectedModuleId}
        risks={risks}
        trend={trend}
        oneWaySeconds={oneWay}
        blackout={store.blackout}
        onClose={() => {
          store.setSelectedModuleId(null);
          store.setSelectedRegion(null);
        }}
      />
    </div>
  );
}
