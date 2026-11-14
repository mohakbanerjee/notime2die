/**
 * Triage — combine RiskResult + autonomy mode + timeToAct into crew-facing guidance.
 * If timeToAct is shorter than round trip, force at least CREW_LED and say why.
 */
import { getAutonomyMode, type AutonomyMode } from "./autonomy";
import { formatDelay, roundTrip } from "./delay";
import type { RiskResult, Step } from "./types";

export type TriageOutput = {
  headline: string;
  mode: AutonomyMode;
  requestedMode: AutonomyMode;
  forcedUpgrade: boolean;
  forceReason?: string;
  steps: Step[];
  groundMessage: string;
  replyEta: string;
  timeToActMinutes: number;
  roundTripSeconds: number;
};

export function triage(
  risk: RiskResult,
  moduleName: string,
  oneWaySeconds: number,
  blackout: boolean
): TriageOutput {
  const requestedMode = getAutonomyMode(oneWaySeconds, blackout);
  const rt = roundTrip(oneWaySeconds);
  const timeToActSeconds = risk.timeToActMinutes * 60;

  let mode = requestedMode;
  let forcedUpgrade = false;
  let forceReason: string | undefined;

  if (
    !blackout &&
    risk.level !== "green" &&
    timeToActSeconds < rt &&
    requestedMode === "EARTH_GUIDED"
  ) {
    // Earth cannot answer before action is needed
    mode = "CREW_LED";
    forcedUpgrade = true;
    forceReason = `Time to act (${risk.timeToActMinutes} min) is shorter than Earth round trip (${formatDelay(rt)}). Acting onboard first.`;
  } else if (
    !blackout &&
    risk.level !== "green" &&
    timeToActSeconds < rt &&
    requestedMode === "FULL_AUTONOMY"
  ) {
    // Already full autonomy; still note the timing
    forceReason = `Time to act (${risk.timeToActMinutes} min) is shorter than round trip (${formatDelay(rt)}).`;
  } else if (
    !blackout &&
    risk.level !== "green" &&
    timeToActSeconds < rt &&
    requestedMode === "CREW_LED"
  ) {
    forceReason = `Time to act (${risk.timeToActMinutes} min) is shorter than round trip (${formatDelay(rt)}).`;
  }

  const steps = risk.protocol;
  let headline: string;
  let groundMessage: string;
  let replyEta: string;

  if (mode === "EARTH_GUIDED") {
    headline = "Contact Earth: flight surgeon looped in";
    groundMessage = `${moduleName} ${risk.level.toUpperCase()}: ${risk.reasons[0] ?? "See details."} Live consult requested.`;
    replyEta = formatDelay(rt);
  } else if (mode === "CREW_LED") {
    headline = "Here is what to do now";
    groundMessage = `AUTO SUMMARY — ${moduleName} ${risk.level}: ${risk.reasons[0] ?? ""}. Crew executing ${steps.length} steps. Reply ETA ${formatDelay(rt)}.`;
    replyEta = formatDelay(rt);
  } else {
    headline = blackout
      ? "You are on your own: full protocol (blackout)"
      : "You are on your own: full protocol";
    groundMessage = blackout
      ? `QUEUED UNTIL LINK — ${moduleName} ${risk.level}: ${risk.reasons[0] ?? ""}. Full protocol logged for later sync.`
      : `LOG FOR LATER SYNC — ${moduleName} ${risk.level}: ${risk.reasons[0] ?? ""}. Full protocol executed onboard.`;
    replyEta = blackout ? "queued until link" : formatDelay(rt);
  }

  if (forcedUpgrade && forceReason) {
    groundMessage += ` Note: ${forceReason}`;
  }

  return {
    headline,
    mode,
    requestedMode,
    forcedUpgrade,
    forceReason,
    steps,
    groundMessage,
    replyEta,
    timeToActMinutes: risk.timeToActMinutes,
    roundTripSeconds: rt,
  };
}
