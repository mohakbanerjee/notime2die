# TODO Sunday

Blocked or deferred items from the unattended build. Agent continued past these.

## Open for teammates

- [ ] Attach real sources for every `demoAssumption: true` entry in `src/lib/evidence.ts` (vitals bands, ISS delay, autonomy cutoffs, ISS/Moon dose rates).
- [ ] Drop OSDR reference extracts under `src/data/` (Inspiration4 OSD-569 / OSD-575) and flip `osdrHooks` in `src/lib/flags.ts` when ready.
- [ ] Fill `TEAM_IDEAS.md` with owners for any new modules.
- [ ] Optional: polish PVT full 3-minute UX and audio cue for stimulus.
- [ ] Optional: stronger ECG waveform (current HUD uses HR sparkline).
- [ ] Video capture pass at 1920×1080 using **Run demo** on Bridge / Timeline.
- [ ] If DONKI cache goes stale before submit, run `npm run fetch:donki` locally and commit.

## Done by agent (Phases 0–6)

- Next.js app, design system, evidence library, delay/autonomy, simulator, store
- DONKI SEP cache (75 events)
- Seven health modules + registry + triage + explain
- Bridge HUD, body map, indicator deep dive
- Check-in, PVT, autonomy console, timeline, demo mode, About
- Tests + production build green at each phase commit
