/**
 * Fetch DONKI SEP events for a few 60-day windows and cache to src/data/donki-sep.json.
 * No API key required. App reads only the cached JSON.
 */
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "src", "data", "donki-sep.json");

type Window = { start: string; end: string };

/** Keep windows inside ~60 days; some DONKI endpoints reject larger spans. */
const WINDOWS: Window[] = [
  { start: "2024-01-01", end: "2024-02-29" },
  { start: "2024-03-01", end: "2024-04-29" },
  { start: "2024-05-01", end: "2024-06-29" },
  { start: "2025-01-01", end: "2025-02-28" },
];

async function fetchWindow(w: Window): Promise<unknown[]> {
  const url = `https://ccmc.gsfc.nasa.gov/DONKI-API/get/SEP?startDate=${w.start}&endDate=${w.end}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DONKI ${res.status} for ${w.start}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function main() {
  const all: unknown[] = [];
  let failures = 0;
  for (const w of WINDOWS) {
    try {
      const chunk = await fetchWindow(w);
      all.push(...chunk);
      console.log(`Fetched ${chunk.length} SEP events for ${w.start}..${w.end}`);
    } catch (err) {
      failures += 1;
      console.error("Window failed:", err);
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  if (all.length === 0 && failures === WINDOWS.length) {
    fs.writeFileSync(
      OUT,
      JSON.stringify(
        {
          fetchedAt: new Date().toISOString(),
          source: "https://ccmc.gsfc.nasa.gov/DONKI-API/get/SEP",
          events: [],
        },
        null,
        2
      )
    );
    console.log("Wrote empty events array to", OUT);
    console.log("TODO: run npm run fetch:donki locally");
    return;
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        source: "https://ccmc.gsfc.nasa.gov/DONKI-API/get/SEP",
        events: all,
      },
      null,
      2
    )
  );
  console.log(`Wrote ${all.length} events to ${OUT}`);
}

main();
