import { TimetableFlight } from "./timetableFlight";

export interface Flight {
  flightNumber: string;
  /** ISO format date only */
  date: string;
  emptySeats: number;
  /** NZD */
  price: number;
  departed: Date | undefined;
  arrived: Date | undefined;
}

export const maximumBookingDay = 42; // up to 6 weeks out
