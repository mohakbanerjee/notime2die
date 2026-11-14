/**
 * BodyMap — hand-drawn SVG figure; regions colored by worst module risk.
 */
"use client";

import type { RiskLevel } from "@/lib/types";

export type RegionLevels = Record<string, RiskLevel>;

const FILL: Record<RiskLevel, string> = {
  green: "rgba(46, 229, 155, 0.35)",
  amber: "rgba(245, 185, 66, 0.55)",
  red: "rgba(255, 77, 109, 0.65)",
};

const STROKE: Record<RiskLevel, string> = {
  green: "var(--status-green)",
  amber: "var(--status-amber)",
  red: "var(--status-red)",
};

type BodyMapProps = {
  levels: RegionLevels;
  selected?: string | null;
  onSelect: (region: string) => void;
};

function regionClass(level: RiskLevel): string {
  if (level === "red") return "pulse-red";
  if (level === "amber") return "pulse-amber";
  return "";
}

export function BodyMap({ levels, selected, onSelect }: BodyMapProps) {
  const lvl = (id: string): RiskLevel => levels[id] ?? "green";

  const Region = ({
    id,
    d,
    label,
  }: {
    id: string;
    d: string;
    label: string;
  }) => {
    const level = lvl(id);
    return (
      <path
        d={d}
        fill={FILL[level]}
        stroke={selected === id ? "var(--border-cyan)" : STROKE[level]}
        strokeWidth={selected === id ? 2.5 : 1.4}
        className={`cursor-pointer ${regionClass(level)}`}
        onClick={() => onSelect(id)}
        role="button"
        tabIndex={0}
        aria-label={`${label}: ${level}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect(id);
        }}
      />
    );
  };

  return (
    <svg viewBox="0 0 200 420" className="mx-auto h-auto w-full max-w-[220px]" aria-label="Crew body map">
      {/* mind halo */}
      <ellipse
        cx="100"
        cy="42"
        rx="48"
        ry="28"
        fill={FILL[lvl("mind")]}
        stroke={STROKE[lvl("mind")]}
        strokeWidth="1.2"
        strokeDasharray="4 3"
        className={`cursor-pointer ${regionClass(lvl("mind"))}`}
        onClick={() => onSelect("mind")}
        role="button"
        aria-label={`Mind: ${lvl("mind")}`}
      />
      <Region id="head" label="Head" d="M78 28 h44 a22 22 0 0 1 0 44 h-44 a22 22 0 0 1 0 -44 z" />
      {/* eyes */}
      <ellipse
        cx="88"
        cy="48"
        rx="8"
        ry="5"
        fill={FILL[lvl("eyes")]}
        stroke={STROKE[lvl("eyes")]}
        className={`cursor-pointer ${regionClass(lvl("eyes"))}`}
        onClick={() => onSelect("eyes")}
        role="button"
        aria-label={`Eyes: ${lvl("eyes")}`}
      />
      <ellipse
        cx="112"
        cy="48"
        rx="8"
        ry="5"
        fill={FILL[lvl("eyes")]}
        stroke={STROKE[lvl("eyes")]}
        className={`cursor-pointer ${regionClass(lvl("eyes"))}`}
        onClick={() => onSelect("eyes")}
        role="button"
        aria-label={`Eyes: ${lvl("eyes")}`}
      />
      {/* neck */}
      <rect x="92" y="72" width="16" height="18" fill="rgba(30,230,255,0.08)" stroke="var(--border-dim)" />
      <Region
        id="chest"
        label="Chest / heart"
        d="M70 90 h60 l10 55 h-80 z"
      />
      {/* heart mark */}
      <path
        d="M100 115 c-6 -8 -18 -2 -12 10 c4 8 12 14 12 14 s8 -6 12 -14 c6 -12 -6 -18 -12 -10 z"
        fill="rgba(255,77,109,0.45)"
        pointerEvents="none"
      />
      <Region id="lungs" label="Lungs" d="M55 100 h20 l8 50 h-28 z M125 100 h20 l0 50 h-28 z" />
      <Region id="spine" label="Spine" d="M96 145 h8 v70 h-8 z" />
      <Region id="hips" label="Hips" d="M68 210 h64 l12 40 h-88 z" />
      <Region id="legs" label="Legs" d="M72 250 h24 l6 120 h-28 z M104 250 h24 l-2 120 h-28 z" />
      {/* skin outline hint */}
      <path
        d="M60 95 q-18 40 0 90"
        fill="none"
        stroke={STROKE[lvl("skin")]}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.45"
        className={`cursor-pointer ${regionClass(lvl("skin"))}`}
        onClick={() => onSelect("skin")}
      />
      <path
        d="M140 95 q18 40 0 90"
        fill="none"
        stroke={STROKE[lvl("skin")]}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.45"
        className={`cursor-pointer ${regionClass(lvl("skin"))}`}
        onClick={() => onSelect("skin")}
      />
      <text x="100" y="410" textAnchor="middle" fill="var(--text-dim)" fontSize="9" letterSpacing="2">
        TAP REGION
      </text>
    </svg>
  );
}
