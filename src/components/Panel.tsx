/**
 * Panel — bordered mission-control container with optional cyan glow.
 */
import { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  title?: string;
  className?: string;
  glow?: boolean;
};

export function Panel({ children, title, className = "", glow = true }: PanelProps) {
  return (
    <section
      className={`rounded-sm bg-[var(--bg-panel)] ${glow ? "panel-glow" : "border border-[var(--border-dim)]"} ${className}`}
    >
      {title ? (
        <header className="border-b border-[var(--border-dim)] px-3 py-2">
          <h2 className="label-caps m-0">{title}</h2>
        </header>
      ) : null}
      <div className="p-3">{children}</div>
    </section>
  );
}
