# AI Usage

This project was built with an **AI coding agent (Cursor)** under team direction for NASA Space Apps 2026.

## What the AI generated

- Project scaffolding (Next.js App Router, Tailwind, Vitest, framer-motion, recharts, zustand)
- Design-system HUD components and mission-control styling (`Panel`, `StatusPill`, `Gauge`, `Sparkline`, `HudHeader`, `DelayDial`, body map)
- Evidence library wiring, delay / autonomy logic, mission profiles, seeded simulator, zustand store
- DONKI fetch script + offline cache reader
- Health modules (cardiovascular, radiation, bone/muscle, sleep/fatigue, behavioral, vision/SANS, immune), registry, triage, explainability
- Screens: Bridge, indicator deep-dive, check-in, PVT, autonomy console, timeline, About
- 30-second demo script (Moon → SEP → delay wow → bone → fatigue)
- Unit tests and phase documentation (`README`, `TEAM_IDEAS`, `TODO_SUNDAY`)

## What came from the team

- Product pitch: *a health copilot that knows how far Earth is*
- Challenge framing and Space Apps constraints (no NASA branding, simulated crew data, disclaimer)
- Seed evidence list and required public sources
- Phase plan, module list, autonomy mode behavior, demo story beats
- Design direction (dark mission control, cyan panels, delay dial as the wow moment)

## Notes

- No paid APIs or secret keys were used.
- Numbers without a cited source are marked `demoAssumption: true` in `src/lib/evidence.ts` and labeled in the UI.
- Teammates should review medical wording before public demos; this is not a medical device.
