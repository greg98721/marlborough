import { Flight, ReturnBooking, OneWayBooking, TimetableFlight, Ticket, FlightBooking } from "@marlborough/model";

/** Cache the linked flight detail to simplify the code */
export interface ClientOneWayBooking extends OneWayBooking {
  flight: Flight;
  timetableFlight: TimetableFlight;
}

/** Cache the linked flight detail to simplify the code */
export interface ClientReturnBooking extends ReturnBooking {
  outboundFlight: Flight;
  outboundTimetableFlight: TimetableFlight;
  inboundFlight: Flight;
  inboundTimetableFlight: TimetableFlight;
}

export type ClientFlightBooking = ClientOneWayBooking | ClientReturnBooking;

export function asFlightBooking(b: ClientFlightBooking): FlightBooking {
  if (b.kind === 'return') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
    const { outboundFlight, outboundTimetableFlight, inboundFlight, inboundTimetableFlight, ...returnBooking } = b;
    return returnBooking;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
    const { flight, timetableFlight, ...onewayBooking } = b;
    return onewayBooking;
  }
}

export function createOneWayFlight(flight: Flight, timetableFlight: TimetableFlight, passengerName: string): ClientFlightBooking {
  const firstTicket: Ticket = {
    customerName: passengerName,
    ticketType: 'unknown',
    passengerType: 'unknown',
    price: undefined
  };
  return {
    kind: 'oneWay',
    date: flight.date,
    flightNumber: flight.flightNumber,
    tickets: [firstTicket],
    flight: flight,
    timetableFlight: timetableFlight
  }
}

export function addReturnFlight(booking: ClientFlightBooking, returnFlight: Flight, returnTimetableFlight: TimetableFlight): ClientFlightBooking {
  if (booking.kind === 'oneWay') {
    if (booking.date === returnFlight.date && booking.flightNumber === returnFlight.flightNumber) {
      throw new Error('Cannot return on the same flight');
    }
    // TODO return flight cannot leave before the outbound flight arrives + 1 hour
    const numDiscountSeatsRequired = booking.tickets.filter(t => t.ticketType === 'discount').length;
    const numFullSeatsRequired = booking.tickets.filter(t => t.ticketType === 'full').length;
    let inboundTickets: Ticket[] = [];
    if (numDiscountSeatsRequired <= returnFlight.emptyDiscountSeats && numFullSeatsRequired <= returnFlight.emptyFullPriceSeats) {
      // just duplicate the tickets for the return flight
      inboundTickets = booking.tickets.map(t => {
        const price = t.ticketType === 'discount' ? returnFlight.discountPrice : returnFlight.fullPrice;
        return {
          customerName: t.customerName,
          ticketType: t.ticketType,
          passengerType: t.passengerType,
          price: price
        };
      });
    } else if (booking.tickets.length <= returnFlight.emptyDiscountSeats + returnFlight.emptyFullPriceSeats) {
      // there are enough seats but not necessarily the right type
      inboundTickets = booking.tickets.map(t => {
        return {
          customerName: t.customerName,
          ticketType: 'unknown',
          passengerType: t.passengerType,
          price: undefined
        };
      });
    }
    return {
      kind: 'return',
      outboundDate: booking.date,
      outboundFlightNumber: booking.flightNumber,
      outboundTickets: booking.tickets,
      inboundDate: returnFlight.date,
      inboundFlightNumber: returnFlight.flightNumber,
      inboundTickets: inboundTickets,
      outboundFlight: booking.flight,
      outboundTimetableFlight: booking.timetableFlight,
      inboundFlight: returnFlight,
      inboundTimetableFlight: returnTimetableFlight
    };
  } else {
    return booking;
  }
}
