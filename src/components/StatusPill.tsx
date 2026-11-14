/**
 * StatusPill — green / amber / red status chip with text (color is never the only signal).
 */
export type StatusLevel = "green" | "amber" | "red";

const STYLES: Record<StatusLevel, { bg: string; label: string; icon: string }> = {
  green: { bg: "bg-[var(--status-green)]/15 text-[var(--status-green)] border-[var(--status-green)]/40", label: "NOMINAL", icon: "●" },
  amber: { bg: "bg-[var(--status-amber)]/15 text-[var(--status-amber)] border-[var(--status-amber)]/40", label: "CAUTION", icon: "▲" },
  red: { bg: "bg-[var(--status-red)]/15 text-[var(--status-red)] border-[var(--status-red)]/40", label: "ALERT", icon: "■" },
};

type StatusPillProps = {
  level: StatusLevel;
  text?: string;
  className?: string;
};

export function StatusPill({ level, text, className = "" }: StatusPillProps) {
  const s = STYLES[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.65rem] tracking-[0.12em] uppercase ${s.bg} ${className}`}
      role="status"
      aria-label={`${s.label}${text ? `: ${text}` : ""}`}
    >
      <span aria-hidden>{s.icon}</span>
      <span>{text ?? s.label}</span>
    </span>
  );
}
