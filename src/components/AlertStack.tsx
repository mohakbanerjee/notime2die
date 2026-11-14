/**
 * AlertStack — severity-sorted alerts; headline animates when delay/mode changes.
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { StatusPill } from "./StatusPill";
import { EvidenceLinks } from "./EvidenceLinks";
import { triage } from "@/lib/triage";
import type { ModuleRisk } from "@/lib/evaluate";

type AlertStackProps = {
  risks: ModuleRisk[];
  oneWaySeconds: number;
  blackout: boolean;
  onOpenModule: (moduleId: string) => void;
};

const order = { red: 0, amber: 1, green: 2 };

export function AlertStack({ risks, oneWaySeconds, blackout, onOpenModule }: AlertStackProps) {
  const alerts = [...risks]
    .filter((r) => r.result.level !== "green")
    .sort((a, b) => order[a.result.level] - order[b.result.level] || b.result.score - a.result.score);

  if (alerts.length === 0) {
    return <p className="text-sm text-[var(--text-dim)]">No active cautions. All modules nominal.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      <AnimatePresence mode="popLayout">
        {alerts.map((a) => {
          const t = triage(a.result, a.name, oneWaySeconds, blackout);
          return (
            <motion.li
              key={a.moduleId}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="border border-[var(--border-dim)] bg-[var(--bg-panel-2)] p-2"
            >
              <div className="flex items-start justify-between gap-2">
                <StatusPill level={a.result.level} text={a.name} />
                <button
                  type="button"
                  className="label-caps cursor-pointer border-0 bg-transparent text-[var(--border-cyan)]"
                  onClick={() => onOpenModule(a.moduleId)}
                >
                  Open
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={t.headline}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-2 mb-1 text-sm font-medium text-[var(--text)]"
                >
                  {t.headline}
                </motion.p>
              </AnimatePresence>
              <p className="m-0 text-xs text-[var(--text-dim)]">{a.result.reasons[0]}</p>
              <div className="mt-2">
                <EvidenceLinks ids={a.result.evidenceIds.slice(0, 3)} />
              </div>
              <Link
                href={`/indicator/${a.moduleId}`}
                className="label-caps mt-2 inline-block text-[var(--border-cyan)]"
              >
                Deep dive →
              </Link>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
