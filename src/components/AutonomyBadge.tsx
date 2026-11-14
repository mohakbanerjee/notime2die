/**
 * AutonomyBadge — EARTH GUIDED / CREW LED / FULL AUTONOMY chip.
 */
import { autonomyLabel, type AutonomyMode } from "@/lib/autonomy";

const STYLES: Record<AutonomyMode, string> = {
  EARTH_GUIDED: "border-[var(--status-green)]/50 text-[var(--status-green)] bg-[var(--status-green)]/10",
  CREW_LED: "border-[var(--status-amber)]/50 text-[var(--status-amber)] bg-[var(--status-amber)]/10",
  FULL_AUTONOMY: "border-[var(--status-red)]/50 text-[var(--status-red)] bg-[var(--status-red)]/10",
};

export function AutonomyBadge({ mode }: { mode: AutonomyMode }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-1 text-[0.65rem] tracking-[0.14em] uppercase ${STYLES[mode]}`}
      role="status"
    >
      {autonomyLabel(mode)}
    </span>
  );
}
