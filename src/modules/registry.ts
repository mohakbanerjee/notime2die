/**
 * Module registry — add a file + one line here to show up on body map, alerts, timeline.
 */
import type { HealthModule } from "./types";
import { cardiovascular } from "./cardiovascular";
import { radiation } from "./radiation";
import { boneMuscle } from "./bone_muscle";
import { sleepFatigue } from "./sleep_fatigue";
import { behavioral } from "./behavioral";
import { visionSans } from "./vision_SANS";
import { immune } from "./immune";

export const MODULES: HealthModule[] = [
  cardiovascular,
  radiation,
  boneMuscle,
  sleepFatigue,
  behavioral,
  visionSans,
  immune,
];

export function getModule(id: string): HealthModule | undefined {
  return MODULES.find((m) => m.id === id);
}

export function modulesForRegion(region: string): HealthModule[] {
  return MODULES.filter((m) => m.bodyRegion === region);
}
