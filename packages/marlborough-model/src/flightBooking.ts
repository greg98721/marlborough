import { Flight } from "./flight";
import { TimetableFlight } from "./timetableFlight";

export type TicketType = 'unknown' | 'full' | 'discount';
export type PassengerType = 'unknown' | 'adult' | 'child';

export interface Ticket {
  firstName: string;
  surname: string;
  ticketType: TicketType;
  passengerType: PassengerType;
  // seatNumber: string;
  price?: number;
}

export interface OneWayBooking {
  kind: 'oneWay';
  date: string;
  flightNumber: string;
  tickets: Ticket[];
}

export interface ReturnBooking {
  kind: 'return';
  outboundDate: string;
  outboundFlightNumber: string;
  inboundDate: string;
  inboundFlightNumber: string;
  tickets: Ticket[];
}

export type FlightBooking = OneWayBooking | ReturnBooking;
