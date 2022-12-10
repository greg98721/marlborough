import { PlainDate } from './timetableFlight';

export interface Flight {
    flightNumber: string;
    /** days since 1/12/2022 */
    date: number;
    emptySeats: number;
    /** Normal JS Date with timezone as this records an event */
    departed: Date | undefined;
    arrived: Date | undefined;
}
