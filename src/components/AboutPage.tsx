/**
 * AboutPage — problem, RIDGE, scoring, delay/autonomy tables, evidence library, privacy, AI.
 */
"use client";

import { EVIDENCE } from "@/lib/evidence";
import { DELAY_PRESETS, formatDelay, roundTrip } from "@/lib/delay";
import { getAutonomyMode } from "@/lib/autonomy";
import { Panel } from "./Panel";

export function AboutPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <h1 className="m-0 font-[family-name:var(--font-jetbrains)] text-2xl tracking-[0.16em] text-[var(--border-cyan)] uppercase">
        About NoTime2Die
      </h1>

      <div
        className="border border-[var(--status-amber)] bg-[var(--status-amber)]/10 px-3 py-2 text-sm text-[var(--status-amber)]"
        role="note"
      >
        Not a medical device. Research prototype for NASA Space Apps 2026.
      </div>

      <Panel title="Problem">
        <p className="m-0 text-sm text-[var(--text-dim)]">
          As crews travel farther from Earth, light-time delay and blackouts break the classic
          &quot;call the flight surgeon&quot; loop. NoTime2Die is a health copilot that gathers
          indicators, scores risk with explainable thresholds and sources, and changes how much it
          hands to the crew as the comms delay grows.
        </p>
      </Panel>

      <Panel title="RIDGE hazards">
        <p className="m-0 text-sm text-[var(--text-dim)]">
          Modules are tagged to the five HRP RIDGE hazards: Radiation (R), Isolation (I), Distance
          from Earth (D), Gravity fields (G), and closed Environments (E). See{" "}
          <a
            href="https://www.nasa.gov/hrp/hazards/"
            className="text-[var(--border-cyan)]"
            target="_blank"
            rel="noreferrer"
          >
            nasa.gov/hrp/hazards
          </a>
          .
        </p>
      </Panel>

      <Panel title="How scoring works">
        <ol className="m-0 list-decimal space-y-1 pl-4 text-sm text-[var(--text-dim)]">
          <li>Each health module reads simulated vitals / self-reports / PVT.</li>
          <li>It returns green / amber / red with plain-English reasons and evidence ids.</li>
          <li>
            Triage combines the risk with the current one-way delay (never hardcoded) to pick EARTH
            GUIDED, CREW LED, or FULL AUTONOMY.
          </li>
          <li>If time-to-act is shorter than round trip, crew-led action is forced first.</li>
        </ol>
      </Panel>

      <Panel title="Delay presets & autonomy">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="label-caps border-b border-[var(--border-dim)]">
                <th className="py-1 pr-2">Preset</th>
                <th className="py-1 pr-2">One way</th>
                <th className="py-1 pr-2">Round trip</th>
                <th className="py-1">Mode</th>
              </tr>
            </thead>
            <tbody>
              {DELAY_PRESETS.map((p) => {
                const mode = getAutonomyMode(p.oneWaySeconds, false);
                return (
                  <tr key={p.id} className="border-b border-[var(--border-dim)]/50">
                    <td className="py-1 pr-2">{p.label}</td>
                    <td className="num py-1 pr-2">{formatDelay(p.oneWaySeconds)}</td>
                    <td className="num py-1 pr-2">{formatDelay(roundTrip(p.oneWaySeconds))}</td>
                    <td className="py-1">{mode.replaceAll("_", " ")}</td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-1 pr-2">Blackout</td>
                <td className="py-1 pr-2">—</td>
                <td className="py-1 pr-2">—</td>
                <td className="py-1">FULL AUTONOMY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Evidence library">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="label-caps border-b border-[var(--border-dim)]">
                <th className="py-1 pr-2">Id</th>
                <th className="py-1 pr-2">Value</th>
                <th className="py-1 pr-2">Meaning</th>
                <th className="py-1">Source</th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE.map((e) => (
                <tr key={e.id} className="border-b border-[var(--border-dim)]/40 align-top">
                  <td className="num py-1 pr-2 text-[var(--border-cyan)]">{e.id}</td>
                  <td className="num py-1 pr-2">
                    {String(e.value)} {e.unit}
                  </td>
                  <td className="py-1 pr-2 text-[var(--text-dim)]">{e.meaning}</td>
                  <td className="py-1">
                    {e.demoAssumption ? (
                      <span className="text-[var(--status-amber)]">demo assumption</span>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Privacy principles">
        <ul className="m-0 list-disc space-y-1 pl-4 text-sm text-[var(--text-dim)]">
          <li>Astronaut owns their data.</li>
          <li>Local first — no backend, no accounts, no cloud sync in this prototype.</li>
          <li>Share by choice (journal opt-in for ground packet).</li>
          <li>No surveillance score — modules explain themselves; no hidden ranking of crew.</li>
        </ul>
      </Panel>

      <Panel title="Disclaimer">
        <p className="m-0 text-sm text-[var(--text-dim)]">
          Simulated crew data only. Not for clinical use. Thresholds marked demo assumption are
          design choices until the team attaches a source. No NASA logos or official branding.
        </p>
      </Panel>

      <Panel title="AI usage summary">
        <p className="m-0 text-sm text-[var(--text-dim)]">
          Large parts of this codebase were generated with an AI coding agent (Cursor) under team
          direction. The pitch, phase plan, evidence seed list, and design decisions came from the
          team. See <code>AI_USAGE.md</code>.
        </p>
      </Panel>
    </div>
  );
}
