/**
 * ModuleDrawer — side panel for a body region / module with triage for current delay.
 */
"use client";

import Link from "next/link";
import { Panel } from "./Panel";
import { StatusPill } from "./StatusPill";
import { Sparkline } from "./Sparkline";
import { EvidenceLinks } from "./EvidenceLinks";
import { triage } from "@/lib/triage";
import { explainRisk } from "@/lib/explain";
import { getModule } from "@/modules/registry";
import type { ModuleRisk } from "@/lib/evaluate";

type ModuleDrawerProps = {
  moduleId: string | null;
  risks: ModuleRisk[];
  trend: number[];
  oneWaySeconds: number;
  blackout: boolean;
  onClose: () => void;
};

export function ModuleDrawer({
  moduleId,
  risks,
  trend,
  oneWaySeconds,
  blackout,
  onClose,
}: ModuleDrawerProps) {
  if (!moduleId) return null;
  const mod = getModule(moduleId);
  const risk = risks.find((r) => r.moduleId === moduleId);
  if (!mod || !risk) return null;

  const t = triage(risk.result, risk.name, oneWaySeconds, blackout);
  const expl = explainRisk(risk.result, t.mode, oneWaySeconds, blackout);

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-[var(--border-cyan)]/40 bg-[var(--bg-deep)]/95 p-3 shadow-[-12px_0_40px_rgba(0,0,0,0.5)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="m-0 font-[family-name:var(--font-jetbrains)] tracking-widest text-[var(--border-cyan)] uppercase">
          {mod.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="label-caps cursor-pointer border border-[var(--border-dim)] bg-transparent px-2 py-1 text-[var(--text)]"
        >
          Close
        </button>
      </div>
      <StatusPill level={risk.result.level} />
      <Panel title="Trend" className="mt-3" glow={false}>
        <Sparkline data={trend} width={280} height={40} />
      </Panel>
      <Panel title="Why" className="mt-3" glow={false}>
        <ul className="m-0 list-disc space-y-1 pl-4 text-sm text-[var(--text-dim)]">
          {expl.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[var(--text-dim)]">{expl.autonomyText}</p>
        {t.forceReason ? (
          <p className="mt-1 text-xs text-[var(--status-amber)]">{t.forceReason}</p>
        ) : null}
      </Panel>
      <Panel title="Sources" className="mt-3" glow={false}>
        <EvidenceLinks ids={risk.result.evidenceIds} />
      </Panel>
      <Panel title={t.headline} className="mt-3" glow={false}>
        <ol className="m-0 list-decimal space-y-1 pl-4 text-sm">
          {t.steps.map((s) => (
            <li key={s.id}>{s.text}</li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-[var(--text-dim)]">Ground packet ETA: {t.replyEta}</p>
      </Panel>
      <Link
        href={`/indicator/${moduleId}`}
        className="label-caps mt-3 inline-block text-[var(--border-cyan)]"
      >
        Open indicator deep dive →
      </Link>
    </aside>
  );
}
