import {
  startOfDay,
  endOfDay
} from 'date-fns/fp'; // Note using the functional version of the date-fns library
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

function calculateInTimezone(fn: (dt: Date) => Date, timezone: string, d: Date): Date {
  const u = d.getTime();
  const z = utcToZonedTime(u, timezone);
  const r = fn(z);
  return r;
}

export function startOfDayInTimezone(timezone: string, d: Date): Date {
  return calculateInTimezone(startOfDay, timezone, d);
}

export function endOfDayInTimezone(timezone: string, d: Date): Date {
  return calculateInTimezone(endOfDay, timezone, d);
}
