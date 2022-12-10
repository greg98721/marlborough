import { PlainDate } from "./timetableFlight";

export interface Booking {
    date: PlainDate;
    flightNumber: string;
    customerCode: string;
    seatNumber: string;
    price: number;
}