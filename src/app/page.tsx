/**
 * Mission Bridge placeholder — Phase 0 shell; full HUD lands in Phase 3.
 */
import { Panel } from "@/components/Panel";
import { StatusPill } from "@/components/StatusPill";
import { Gauge } from "@/components/Gauge";
import { Sparkline } from "@/components/Sparkline";

export default function BridgePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-3">
      <Panel title="System" className="md:col-span-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 font-[family-name:var(--font-jetbrains)] text-2xl tracking-[0.12em] text-[var(--border-cyan)] uppercase">
            NoTime2Die
          </h1>
          <StatusPill level="green" text="Phase 0 online" />
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-dim)]">
          Mission Bridge shell. Delay dial, vitals, body map, and autonomy triage come online in later
          phases. Design system components are ready for the team.
        </p>
      </Panel>
      <Panel title="Vitals preview">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="label-caps">HR</div>
            <div className="num text-2xl text-[var(--status-green)]">72</div>
          </div>
          <Sparkline data={[68, 70, 69, 72, 74, 71, 73, 72]} color="var(--status-green)" />
        </div>
      </Panel>
      <Panel title="Dose gauge">
        <div className="flex justify-center">
          <Gauge value={42} max={600} label="Cumulative" unit="mSv" level="green" />
        </div>
      </Panel>
      <Panel title="Status kit">
        <div className="flex flex-wrap gap-2">
          <StatusPill level="green" />
          <StatusPill level="amber" />
          <StatusPill level="red" />
        </div>
      </Panel>
    </div>
  );
}
