/**
 * DelayDial — mission delay presets, log-scale custom slider, blackout toggle.
 * Reads/writes only through callbacks so the store stays the single source of truth.
 */
"use client";

import { DELAY_PRESETS, formatDelay, type DelayPreset } from "@/lib/delay";

type DelayDialProps = {
  presetId: string;
  customSeconds: number;
  blackout: boolean;
  oneWaySeconds: number;
  onPreset: (id: string) => void;
  onCustom: (seconds: number) => void;
  onBlackout: (v: boolean) => void;
};

/** Map linear 0–1 slider to log-scale seconds (0.5 s … 24 h). */
export function sliderToSeconds(t: number): number {
  const min = Math.log(0.5);
  const max = Math.log(86400);
  return Math.exp(min + t * (max - min));
}

export function secondsToSlider(s: number): number {
  const min = Math.log(0.5);
  const max = Math.log(86400);
  const clamped = Math.max(0.5, Math.min(86400, s));
  return (Math.log(clamped) - min) / (max - min);
}

export function DelayDial({
  presetId,
  customSeconds,
  blackout,
  oneWaySeconds,
  onPreset,
  onCustom,
  onBlackout,
}: DelayDialProps) {
  const slider = secondsToSlider(presetId === "custom" ? customSeconds : oneWaySeconds);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {DELAY_PRESETS.map((p: DelayPreset) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPreset(p.id)}
            className={`label-caps cursor-pointer border px-2 py-1 ${
              presetId === p.id && !blackout
                ? "border-[var(--border-cyan)] text-[var(--border-cyan)] bg-[var(--border-cyan)]/10"
                : "border-[var(--border-dim)] text-[var(--text-dim)] bg-transparent"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPreset("custom")}
          className={`label-caps cursor-pointer border px-2 py-1 ${
            presetId === "custom" && !blackout
              ? "border-[var(--border-cyan)] text-[var(--border-cyan)] bg-[var(--border-cyan)]/10"
              : "border-[var(--border-dim)] text-[var(--text-dim)] bg-transparent"
          }`}
        >
          Custom
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
        <span className="label-caps w-16 shrink-0">Delay</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={slider}
          onChange={(e) => {
            onPreset("custom");
            onCustom(sliderToSeconds(Number(e.target.value)));
          }}
          className="w-full accent-[var(--border-cyan)]"
          aria-label="Custom one-way delay (log scale)"
        />
        <span className="num w-24 text-right text-[var(--text)]">{formatDelay(oneWaySeconds)}</span>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={blackout}
          onChange={(e) => onBlackout(e.target.checked)}
          className="accent-[var(--status-red)]"
        />
        <span className="label-caps text-[var(--status-red)]">Blackout (no link)</span>
      </label>
    </div>
  );
}
