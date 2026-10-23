import type { IRelativeTimeParts } from "./relativeTime.type";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

const UNITS: readonly { unit: IRelativeTimeParts["unit"]; ms: number }[] = [
  { unit: "year", ms: YEAR_MS },
  { unit: "month", ms: MONTH_MS },
  { unit: "day", ms: DAY_MS },
  { unit: "hour", ms: HOUR_MS },
  { unit: "minute", ms: MINUTE_MS },
];

/** Largest whole unit elapsed between `then` and `now`; null under a minute or in the future. */
export function relativeTimeParts(then: number, now: number): IRelativeTimeParts | null {
  const elapsed = now - then;
  const match = UNITS.find(({ ms }) => elapsed >= ms);
  if (!match) return null;
  return { value: Math.floor(elapsed / match.ms), unit: match.unit };
}
