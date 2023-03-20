import { Flight } from "./flight";
import { TimetableFlight } from "./timetableFlight";

export type TicketType = 'unknown' | 'full' | 'discount';
export type PassengerType = 'unknown' | 'adult' | 'child';

export interface Ticket {
  customerName: string;
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
  outboundTickets: Ticket[];
  inboundDate: string;
  inboundFlightNumber: string;
  inboundTickets: Ticket[];
}

export type FlightBooking = OneWayBooking | ReturnBooking;
