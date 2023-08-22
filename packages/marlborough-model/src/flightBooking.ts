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

interface FlightBookingBase {
  kind: 'oneWay' | 'return';
  purchaserUsername: string;  // all purchasers must be registered users - it is just a test app
}

export interface OneWayBooking extends FlightBookingBase {
  kind: 'oneWay';
  date: string;
  flightNumber: string;
  tickets: Ticket[];
}

export interface ReturnBooking extends FlightBookingBase {
  kind: 'return';
  outboundDate: string;
  outboundFlightNumber: string;
  outboundTickets: Ticket[];
  inboundDate: string;
  inboundFlightNumber: string;
  inboundTickets: Ticket[];
}

export type FlightBooking = OneWayBooking | ReturnBooking;
