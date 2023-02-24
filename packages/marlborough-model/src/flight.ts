import { TimetableFlight } from "./timetableFlight";

export interface Flight {
  flightNumber: string;
  /** ISO format date only */
  date: string;
  emptySeats: number;
  /** NZD */
  price: number;
  departed?: Date;
  arrived?: Date;
}

export const maximumBookingDay = 42; // up to 6 weeks out

export const EMPTY_FLIGHT ={
  flightNumber: "",
  date: "",
  emptySeats: 0,
  price: 0,
  departed: undefined,
  arrived: undefined,
};
