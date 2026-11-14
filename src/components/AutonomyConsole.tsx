/**
 * AutonomyConsole — triage console with decision path, steps, ground packet, comms queue.
 */
"use client";

import { useEffect, useMemo } from "react";
import { useMissionStore } from "@/lib/store";
import { evaluateAll } from "@/lib/evaluate";
import { triage } from "@/lib/triage";
import { autonomyReason } from "@/lib/autonomy";
import { formatDelay, roundTrip } from "@/lib/delay";
import { Panel } from "./Panel";
import { DelayDial } from "./DelayDial";
import { AutonomyBadge } from "./AutonomyBadge";
import { EvidenceLinks } from "./EvidenceLinks";

const PATH = [
  { id: "detect", label: "Detect" },
  { id: "assess", label: "Assess" },
  { id: "act", label: "Act onboard" },
  { id: "inform", label: "Inform ground" },
  { id: "reply", label: "Ground reply" },
] as const;

export function AutonomyConsole() {
  const store = useMissionStore();
  const oneWay = store.oneWaySeconds();
  const mode = store.autonomyMode();

  const risks = useMemo(
    () =>
      evaluateAll({
        seed: store.seed,
        missionId: store.missionId,
        scenario: store.scenario,
        missionDay: store.missionDay,
        selfReports: store.selfReports,
        pvtResults: store.pvtResults,
      }),
    [store]
  );

  const active =
    [...risks]
      .filter((r) => r.result.level !== "green")
      .sort((a, b) => b.result.score - a.result.score)[0] ?? risks[0];

  const t = triage(active.result, active.name, oneWay, store.blackout);

  // Highlight path nodes differently per mode
  const highlight = useMemo(() => {
    if (t.mode === "EARTH_GUIDED") return new Set(["detect", "assess", "inform", "reply"]);
    if (t.mode === "CREW_LED") return new Set(["detect", "assess", "act", "inform", "reply"]);
    return new Set(["detect", "assess", "act", "inform"]); // reply later / queued
  }, [t.mode]);

  function sendPacket() {
    const now = Date.now();
    const demoFactor = 60; // x60 speed in demo
    const rtMs = store.blackout ? 0 : (roundTrip(oneWay) * 1000) / demoFactor;
    store.enqueueComms({
      createdAtMs: now,
      deliverAtMs: store.blackout ? now + 1e12 : now + rtMs,
      summary: t.groundMessage,
      queuedUntilLink: store.blackout,
    });
  }

  // Deliver simulated ground replies after delay
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      for (const p of store.commsQueue) {
        if (!p.delivered && !p.queuedUntilLink && p.deliverAtMs <= now) {
          store.markCommsDelivered(
            p.id,
            `Flight surgeon ack: received "${p.summary.slice(0, 80)}…". Continue protocol; update on next pass.`
          );
        }
      }
    }, 500);
    return () => clearInterval(id);
  }, [store]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-3 p-4">
      <h1 className="m-0 font-[family-name:var(--font-jetbrains)] tracking-widest text-[var(--border-cyan)] uppercase">
        Autonomy console
      </h1>

      <Panel title="Active issue">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{active.name}</span>
          <span className="label-caps">{active.result.level}</span>
          <AutonomyBadge mode={t.mode} />
        </div>
        <p className="text-sm text-[var(--text-dim)]">{active.result.reasons[0]}</p>
        <EvidenceLinks ids={active.result.evidenceIds.slice(0, 4)} />
      </Panel>

      <Panel title="Delay dial">
        <DelayDial
          presetId={store.delayPresetId}
          customSeconds={store.customDelaySeconds}
          blackout={store.blackout}
          oneWaySeconds={oneWay}
          onPreset={store.setDelayPreset}
          onCustom={store.setCustomDelay}
          onBlackout={store.setBlackout}
        />
        <p className="mt-2 text-sm">{autonomyReason(t.mode, oneWay, store.blackout)}</p>
        {t.forceReason ? (
          <p className="text-sm text-[var(--status-amber)]">{t.forceReason}</p>
        ) : null}
      </Panel>

      <Panel title="Decision path">
        <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
          {PATH.map((node, i) => {
            const on = highlight.has(node.id);
            const dimReply = t.mode === "FULL_AUTONOMY" && node.id === "reply";
            return (
              <li key={node.id} className="flex items-center gap-2">
                <span
                  className={`border px-2 py-1 text-xs tracking-wider uppercase ${
                    on
                      ? dimReply
                        ? "border-[var(--text-dim)] text-[var(--text-dim)]"
                        : "border-[var(--border-cyan)] text-[var(--border-cyan)] bg-[var(--border-cyan)]/10"
                      : "border-[var(--border-dim)] text-[var(--text-dim)] opacity-40"
                  }`}
                >
                  {node.label}
                  {dimReply ? " (later)" : ""}
                </span>
                {i < PATH.length - 1 ? <span className="text-[var(--text-dim)]">→</span> : null}
              </li>
            );
          })}
        </ol>
      </Panel>

      <Panel title={t.headline}>
        <ol className="list-decimal space-y-2 pl-4 text-sm">
          {t.steps.map((s) => (
            <li key={s.id}>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 accent-[var(--border-cyan)]" />
                <span>{s.text}</span>
              </label>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Message to ground">
        <pre className="m-0 whitespace-pre-wrap rounded-sm border border-[var(--border-dim)] bg-[var(--bg-deep)] p-2 text-xs text-[var(--text)]">
          {t.groundMessage}
        </pre>
        <p className="text-sm text-[var(--text-dim)]">
          ETA: {t.replyEta}
          {!store.blackout ? ` (demo delivers at ×60 speed · RT ${formatDelay(roundTrip(oneWay))})` : ""}
        </p>
        <button
          type="button"
          onClick={sendPacket}
          className="mt-2 cursor-pointer border border-[var(--border-cyan)] bg-[var(--border-cyan)]/10 px-3 py-2 text-sm text-[var(--border-cyan)]"
        >
          Queue packet
        </button>
      </Panel>

      <Panel title="Comms queue">
        {store.commsQueue.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)]">No packets yet.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {[...store.commsQueue].reverse().map((p) => (
              <li key={p.id} className="border border-[var(--border-dim)] p-2 text-xs">
                <div className="label-caps">
                  {p.queuedUntilLink
                    ? "queued until link"
                    : p.delivered
                      ? "reply received"
                      : "in transit"}
                </div>
                <p className="m-1 text-[var(--text-dim)]">{p.summary}</p>
                {p.reply ? <p className="m-1 text-[var(--status-green)]">{p.reply}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
