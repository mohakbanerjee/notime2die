/**
 * HudHeader — top brand bar with NoTime2Die wordmark and nav links.
 */
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Bridge" },
  { href: "/checkin", label: "Check-in" },
  { href: "/pvt", label: "PVT" },
  { href: "/autonomy", label: "Autonomy" },
  { href: "/timeline", label: "Timeline" },
  { href: "/about", label: "About" },
];

type HudHeaderProps = {
  subtitle?: string;
};

export function HudHeader({ subtitle }: HudHeaderProps) {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-dim)] bg-[var(--bg-panel)]/90 px-4 py-3 backdrop-blur">
      <div className="flex items-baseline gap-3">
        <Link href="/" className="no-underline">
          <span className="font-[family-name:var(--font-jetbrains)] text-lg tracking-[0.18em] text-[var(--border-cyan)] uppercase">
            NoTime2Die
          </span>
        </Link>
        {subtitle ? <span className="label-caps">{subtitle}</span> : null}
      </div>
      <nav className="flex flex-wrap gap-1" aria-label="Primary">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="label-caps px-2 py-1 text-[var(--text-dim)] no-underline transition hover:text-[var(--border-cyan)]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
