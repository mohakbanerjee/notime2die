/**
 * Evidence library — every threshold / model parameter lives here with a source.
 * UI must cite these on risk cards. Never invent a source; use demoAssumption when unsure.
 */

export type EvidenceEntry = {
  id: string;
  value: number | string;
  unit: string;
  meaning: string;
  sourceTitle: string;
  sourceUrl: string;
  demoAssumption?: boolean;
};

export const EVIDENCE: EvidenceEntry[] = [
  {
    id: "light-time-moon",
    value: 1.3,
    unit: "s",
    meaning: "Approximate one-way light time between Earth and the Moon.",
    sourceTitle: "Voyager — What is a light-day?",
    sourceUrl: "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
  },
  {
    id: "light-time-mars-range",
    value: "3–22",
    unit: "min",
    meaning: "One-way light time to Mars varies with orbital geometry from about 3 to 22 minutes.",
    sourceTitle: "Speaking Percy's language — Mars 2020",
    sourceUrl:
      "https://science.nasa.gov/missions/mars-2020-perseverance/speaking-percys-language-how-to-talk-so-perseverance-will-listen/",
  },
  {
    id: "light-time-neptune",
    value: 15000,
    unit: "s",
    meaning: "One-way light time at Neptune distance is about 4 hours 10 minutes (≈15000 s).",
    sourceTitle: "Voyager — What is a light-day?",
    sourceUrl: "https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/",
  },
  {
    id: "mars-blackout",
    value: 14,
    unit: "days",
    meaning: "Solar conjunction can black out Mars links for up to about two weeks; crews must act without real-time ground support.",
    sourceTitle: "NTRS 20250006447 / HRP Distance from Earth",
    sourceUrl: "https://ntrs.nasa.gov/citations/20250006447",
  },
  {
    id: "hazard-distance",
    value: "distance",
    unit: "",
    meaning: "Distance from Earth is a recognized HRP hazard for medical operations and autonomy.",
    sourceTitle: "NASA HRP — Hazard: Distance from Earth",
    sourceUrl: "https://www.nasa.gov/hrp/hazard-distance-from-earth/",
  },
  {
    id: "bone-loss-rate",
    value: "1–1.5",
    unit: "% BMD / month",
    meaning: "Without countermeasures, weight-bearing bones can lose about 1–1.5% bone mineral density per month.",
    sourceTitle: "Risk of Spaceflight Induced Bone Changes",
    sourceUrl: "https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/",
  },
  {
    id: "rad-cruise-mars",
    value: 1.84,
    unit: "mSv/day",
    meaning: "Cruise dose rate to Mars measured by Curiosity RAD during transit.",
    sourceTitle: "Science — Curiosity RAD (2013)",
    sourceUrl: "https://www.science.org/doi/10.1126/science.1244797",
  },
  {
    id: "rad-surface-mars",
    value: 0.64,
    unit: "mSv/day",
    meaning: "Mars surface dose rate from Curiosity RAD.",
    sourceTitle: "Science — Curiosity RAD (2013)",
    sourceUrl: "https://www.science.org/doi/10.1126/science.1244797",
  },
  {
    id: "career-dose-limit",
    value: 600,
    unit: "mSv",
    meaning: "NASA career effective dose limit used as a cumulative dose reference in this demo.",
    sourceTitle: "OCHMO-TB-020 Radiation Protection",
    sourceUrl: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf",
  },
  {
    id: "iss-sleep-avg",
    value: 6.09,
    unit: "h/night",
    meaning: "Average astronaut sleep duration on ISS reported by Barger et al. (2014).",
    sourceTitle: "Barger 2014 — PMC4188436",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4188436/",
  },
  {
    id: "cognition-pvt",
    value: 3,
    unit: "min",
    meaning: "Cognition battery includes a validated 3-minute Psychomotor Vigilance Test (PVT).",
    sourceTitle: "UPenn Cognition battery",
    sourceUrl: "https://www.med.upenn.edu/uep/cognition.html",
  },
  {
    id: "bio-monitor",
    value: "multi",
    unit: "",
    meaning: "Bio-Monitor / Astroskin measures HR/ECG, BP, breathing, skin temp, SpO2, and activity.",
    sourceTitle: "CSA Bio-Monitor",
    sourceUrl: "https://www.asc-csa.gc.ca/eng/sciences/bio-monitor.asp",
  },
  {
    id: "ridge-hazards",
    value: 5,
    unit: "hazards",
    meaning: "Five RIDGE hazards and the HRP risk list frame spaceflight health risks.",
    sourceTitle: "NASA HRP Hazards",
    sourceUrl: "https://www.nasa.gov/hrp/hazards/",
  },
  {
    id: "hrp-risks",
    value: "list",
    unit: "",
    meaning: "Human Research Program curated risk list for crew health.",
    sourceTitle: "NASA HRP Risks",
    sourceUrl: "https://www.nasa.gov/hrp/risks/",
  },
  {
    id: "sans-risk",
    value: "SANS",
    unit: "",
    meaning: "Spaceflight Associated Neuro-ocular Syndrome (SANS) is a tracked HRP risk.",
    sourceTitle: "HRR Risk — SANS",
    sourceUrl: "https://humanresearchroadmap.nasa.gov/Risks/risk.aspx?i=105",
  },
  {
    id: "eimo",
    value: "EIMO",
    unit: "",
    meaning: "Earth Independent Medical Operations: ground becomes consultant; crew medical officer leads.",
    sourceTitle: "NTRS 20250000009",
    sourceUrl: "https://ntrs.nasa.gov/citations/20250000009",
  },
  // Demo assumptions — design choices until the team adds sources
  {
    id: "vitals-hr-bands",
    value: "60–100 / 50–110 / else",
    unit: "bpm",
    meaning: "Heart-rate green / amber / red bands used by the demo risk engine.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "vitals-spo2-bands",
    value: "≥95 / 90–94 / <90",
    unit: "%",
    meaning: "SpO2 green / amber / red bands used by the demo risk engine.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "vitals-bp-bands",
    value: "sys 90–140",
    unit: "mmHg",
    meaning: "Blood-pressure bands used by the demo cardiovascular module.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "vitals-temp-bands",
    value: "36.1–37.5",
    unit: "°C",
    meaning: "Skin/core temperature bands used by the immune module.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "vitals-glucose-bands",
    value: "70–140",
    unit: "mg/dL",
    meaning: "Glucose bands reserved for future metabolic module.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "iss-delay",
    value: 1,
    unit: "s",
    meaning: "ISS treated as near-real-time one-way delay of 1 second for autonomy demos.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "autonomy-earth-guided-rt",
    value: 10,
    unit: "s",
    meaning: "Round-trip under 10 s → EARTH_GUIDED (flight surgeon looped in).",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "autonomy-crew-led-rt",
    value: 3600,
    unit: "s",
    meaning: "Round-trip from 10 s up to 1 h → CREW_LED; above 1 h or blackout → FULL_AUTONOMY.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "rad-iss-demo",
    value: 0.3,
    unit: "mSv/day",
    meaning: "Placeholder ISS dose rate until a sourced value is added.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
  {
    id: "rad-moon-demo",
    value: 0.5,
    unit: "mSv/day",
    meaning: "Placeholder lunar dose rate until a sourced value is added.",
    sourceTitle: "Demo design choice",
    sourceUrl: "",
    demoAssumption: true,
  },
];

export function getEvidence(id: string): EvidenceEntry | undefined {
  return EVIDENCE.find((e) => e.id === id);
}

export function evidenceLabel(id: string): string {
  const e = getEvidence(id);
  if (!e) return id;
  return e.demoAssumption ? `${e.id} (demo assumption)` : e.id;
}
