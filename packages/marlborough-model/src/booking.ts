import { PlainDate } from "./scheduleFlight";

export interface Booking {
    date: PlainDate;
    flightNumber: string;
    customerCode: string;
    seatNumber: string;
    price: number;
}