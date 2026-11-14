/**
 * EvidenceLinks — show source titles on every risk card (demo assumptions labeled).
 */
import { getEvidence } from "@/lib/evidence";

export function EvidenceLinks({ ids }: { ids: string[] }) {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {ids.map((id) => {
        const e = getEvidence(id);
        if (!e) {
          return (
            <li key={id} className="text-[0.7rem] text-[var(--text-dim)]">
              {id}
            </li>
          );
        }
        return (
          <li key={id} className="text-[0.7rem] text-[var(--text-dim)]">
            <span className="text-[var(--border-cyan)]">{e.id}</span>
            {": "}
            {e.demoAssumption ? (
              <span className="text-[var(--status-amber)]">demo assumption — {e.meaning}</span>
            ) : e.sourceUrl ? (
              <a
                href={e.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text)] underline-offset-2 hover:underline"
              >
                {e.sourceTitle}
              </a>
            ) : (
              e.sourceTitle
            )}
          </li>
        );
      })}
    </ul>
  );
}
