import { getDay } from 'date-fns';
import { AirRoute } from './airRoute';

export type Aircraft = 'ATR42' | 'A220-100';

/** A simple date with no time and timezone is that of the airport on that day */
export interface PlainDate {
    /** Usual as in 2022 */
    year: number;
    /** 1 - 12 */
    month: number;
    /** 1 - 31 */
    day: number;
}

/** A simple time and timezone is that of the airport on that day.
 * No seconds value as this is just for scheduling
 */
export interface PlainTime {
    /** 0 - 23 hours */
    hour: number;
    /** 0 - 59 minutes */
    minute: number;
}

export interface ScheduleFlight {
    route: AirRoute;
    aircaft: Aircraft;
    /** Should be unique in each day */
    flightNumber: string;
    departs: PlainTime;
    /** If earlier than departure - can be assumed to be next day */
    arrives: PlainTime;
    /** a 7 bit array - see days below */
    days: number;
    /** first day of operation */
    starts: PlainDate;
    /** last day of operation */
    ends: PlainDate;
}

export const SUNDAY = 0x01;
export const MONDAY = 0x02;
export const TUESDAY = 0x04;
export const WEDNESDAY = 0x08;
export const THURSDAY = 0x10;
export const FRIDAY = 0x20;
export const SATURDAY = 0x40;
export const WEEKDAYS = MONDAY + TUESDAY + WEDNESDAY + THURSDAY + FRIDAY;
export const WEEKEND = SUNDAY + SATURDAY;

export function getSchduleDayFromDate(d: PlainDate): number {
    const n = new Date(d.year, d.month, d.day);
    switch (getDay(n)) {
        case 0: return SUNDAY;
        case 1: return MONDAY;
        case 2: return TUESDAY;
        case 3: return WEDNESDAY;
        case 4: return THURSDAY;
        case 5: return FRIDAY;
        case 6: return SATURDAY;
    }
}