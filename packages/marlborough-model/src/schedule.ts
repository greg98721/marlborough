import { AirRoute } from './airRoute';

export type Aircraft = 'ATR42' | 'A220-100';

export interface ScheduleFlight {
    route: AirRoute;
    aircaft: Aircraft;
    /** decimal hours 0 <= h < 24  */
    departs: number;
    /** decimal hours 0 <= h < 24  */
    arrives: number;
    /** a bit array - see days below */
    days: number;
    /** first day of operation */
    starts: Date;
    /** last day of operation */
    ends: Date;
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
