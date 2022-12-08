import { PlainDate } from './scheduleFlight';

export interface Flight {
    flightNumber: string;
    date: PlainDate;
    aircraftCode: string;
    /** Normal JS Date with timezone as this records an event */
    departed: Date | undefined;
    arrived: Date | undefined;
}