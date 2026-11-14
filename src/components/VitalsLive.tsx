/**
 * VitalsLive — ECG-style trace + SpO2 / BP / resp / temp updating each second.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { generateMinuteVitals } from "@/lib/simulator";
import { Sparkline } from "./Sparkline";
import type { ScenarioId } from "@/lib/types";

type VitalsLiveProps = {
  seed: number;
  missionId: string;
  scenario: ScenarioId;
  missionDay: number;
};

export function VitalsLive({ seed, missionId, scenario, missionDay }: VitalsLiveProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const history = useMemo(() => {
    const baseMinute = (missionDay * 60 + tick) % 1440;
    const pts = [];
    for (let i = 29; i >= 0; i--) {
      const m = (baseMinute - i + 1440) % 1440;
      pts.push(
        generateMinuteVitals(
          { seed, missionId, scenario, missionDay },
          m
        )
      );
    }
    return pts;
  }, [seed, missionId, scenario, missionDay, tick]);

  const latest = history[history.length - 1];
  const hrSeries = history.map((v) => v.hr);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="label-caps">ECG-style HR trace</div>
        <Sparkline data={hrSeries} width={220} height={48} color="var(--status-green)" />
        <div className="num text-3xl text-[var(--status-green)]">{latest.hr}</div>
        <div className="label-caps">bpm</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Vital label="SpO2" value={`${latest.spo2}%`} />
        <Vital label="BP" value={`${latest.bpSys}/${latest.bpDia}`} />
        <Vital label="Resp" value={`${latest.respRate}/min`} />
        <Vital label="Temp" value={`${latest.skinTempC}°C`} />
      </div>
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border-dim)] px-2 py-1">
      <div className="label-caps">{label}</div>
      <div className="num text-lg">{value}</div>
    </div>
  );
}
