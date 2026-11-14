# AI Usage

This project was built with an **AI coding agent (Cursor)** under team direction for NASA Space Apps 2026.

## What the AI generated

- Project scaffolding (Next.js App Router, Tailwind, Vitest)
- Design-system HUD components and mission-control styling
- Evidence library wiring, delay / autonomy logic, simulator, zustand store
- Health modules, triage, explainability text
- Screens: Bridge, indicator deep-dive, check-in, PVT, autonomy console, timeline, About
- Demo-mode script and tests
- README / TEAM_IDEAS / TODO scaffolding

## What came from the team

- Product pitch: *a health copilot that knows how far Earth is*
- Challenge framing and Space Apps constraints (no NASA branding, simulated crew data, disclaimer)
- Seed evidence list and required sources
- Phase plan, module list, autonomy mode behavior, demo story beats
- Design direction (dark mission control, cyan panels, delay dial as the wow moment)

## Notes

- No paid APIs or secret keys were used.
- Numbers without a cited source are marked `demoAssumption: true` in `src/lib/evidence.ts` and labeled in the UI.
