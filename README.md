# NoTime2Die

Health copilot for astronauts that **knows how far Earth is**. Built for NASA Space Apps 2026 — challenge *Create Health Monitoring Software for Astronauts on Space Missions*.

Near Earth it loops in the flight surgeon. Far from Earth it tells the crew exactly what to do now. Same alert, different autonomy.

> Not a medical device. Research prototype. No NASA logos or official branding. Wordmark: **NoTime2Die**.

## Live demo (GitHub Pages)

**https://mohakbanerjee.github.io/notime2die/**

(Public link — no install needed. Deploys automatically on every push to `master`.)

## Run locally

```bash
npm install
npm run dev
```


Build / test:

```bash
npm run build
npm test
```

Optional DONKI refresh (cached JSON ships with the app):

```bash
npm run fetch:donki
```

Open [http://localhost:3000](http://localhost:3000) — use **Run demo** on the Bridge for the 30s wow moment.

## Screens

| Route | Purpose |
|-------|---------|
| `/` | Mission Bridge — delay dial, vitals, body map, alerts |
| `/indicator/[id]` | Deep dive chart + sources + actions |
| `/checkin` | Daily self-report (~90s) |
| `/pvt` | 30s demo or 3 min PVT |
| `/autonomy` | Triage console + ground packet queue |
| `/timeline` | Day scrubber, dose/bone, DONKI overlays |
| `/about` | Evidence library, privacy, disclaimer |

## NASA / public data used

- Light-time references (Moon, Mars, deep space) — NASA Science
- Mars blackout / distance hazard — NTRS + HRP
- Bone loss rates — NASA bone risk page
- Curiosity RAD dose rates — published Science paper
- Career dose limit 600 mSv — OCHMO technical brief
- ISS sleep average — Barger 2014
- Cognition / PVT — UPenn Cognition
- Bio-Monitor capability list — CSA
- RIDGE hazards + HRP risks + SANS — NASA HRP / HRR
- Earth Independent Medical Operations — NTRS
- Cached DONKI SEP events — CCMC DONKI API (offline JSON)

All astronaut vitals and crew names are **simulated**.

## Architecture (text)

```
[ Mission settings store (zustand) ]
        |  delay, blackout, mission, day, scenario, crew
        v
[ Simulator ] ----per-minute/day signals----> [ Health modules ]
                                                    |
                                              RiskResult[]
                                                    v
                                         [ Triage + autonomy mode ]
                                                    |
                              EARTH_GUIDED | CREW_LED | FULL_AUTONOMY
                                                    v
                              [ HUD: Bridge / Body map / Autonomy / Timeline ]
```

- `src/lib/` — evidence, delay, autonomy, missions, simulator, store, triage, explain
- `src/modules/` — one file per health domain; registry wires them everywhere
- `src/components/` — Panel, StatusPill, Gauge, Sparkline, HudHeader, DelayDial, …
- `src/data/` — cached DONKI SEP JSON; room for OSDR refs
- `tests/` — vitest

## Team hooks

1. **New module** — add `src/modules/<name>.ts` + one line in `src/modules/registry.ts`.
2. **Evidence** — entries with `demoAssumption: true` need real sources (`src/lib/evidence.ts`).
3. **Tune autonomy** — cutoffs in evidence + `src/lib/autonomy.ts` / `delay.ts`.
4. **Ideas board** — `TEAM_IDEAS.md`.
5. **OSDR** — drop reference data under `src/data/` (Inspiration4 OSD-569 / OSD-575).
6. **Flags** — `src/lib/flags.ts` to hide unfinished UI for the video.

See also: `TODO_SUNDAY.md`, `AI_USAGE.md`.
