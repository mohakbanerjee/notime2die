/**
 * Gauge — circular progress for dose / scores with monospace readout.
 */
type GaugeProps = {
  value: number;
  max: number;
  label: string;
  unit?: string;
  level?: "green" | "amber" | "red";
  size?: number;
};

const COLORS = {
  green: "var(--status-green)",
  amber: "var(--status-amber)",
  red: "var(--status-red)",
};

export function Gauge({ value, max, label, unit = "", level = "green", size = 88 }: GaugeProps) {
  const pct = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const color = COLORS[level];

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(30,230,255,0.12)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="num"
          fill="var(--text)"
          fontSize="14"
        >
          {value.toFixed(value >= 100 ? 0 : 1)}
        </text>
      </svg>
      <span className="label-caps text-center">
        {label}
        {unit ? ` · ${unit}` : ""}
      </span>
    </div>
  );
}
