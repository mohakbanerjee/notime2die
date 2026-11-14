/**
 * Read cached DONKI SEP events (app never calls the network at runtime).
 */
import cached from "@/data/donki-sep.json";

export type DonkiSepEvent = {
  sepID?: string;
  eventTime?: string;
  instruments?: unknown[];
  linkedEvents?: unknown[];
  [key: string]: unknown;
};

type CacheShape = {
  fetchedAt?: string;
  source?: string;
  events: DonkiSepEvent[];
};

const data = cached as unknown as CacheShape | DonkiSepEvent[];

export function getDonkiEvents(): DonkiSepEvent[] {
  if (Array.isArray(data)) return data;
  return Array.isArray(data.events) ? data.events : [];
}

/** Extract ISO date (YYYY-MM-DD) from an event if present. */
export function eventDate(ev: DonkiSepEvent): string | null {
  const t = ev.eventTime ?? (ev as { beginTime?: string }).beginTime;
  if (typeof t !== "string" || t.length < 10) return null;
  return t.slice(0, 10);
}
