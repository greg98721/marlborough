import { Airport, AirRoute, Flight, TimetableFlight } from "@marlborough/model";

interface BookingStart {
  kind: 'start',
}

interface BookingOrigin {
  kind: 'origin',
  origin: Airport
}

interface BookingDestination {
  kind: 'destination',
  route: AirRoute,
}

interface BookingDate {
  kind: 'date',
  route: AirRoute,
  date: string
}

interface BookingFlight {
  kind: 'flight',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight
  inboundRoute: AirRoute,
}

interface BookingReturnDate {
  kind: 'return-date',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight
  inboundRoute: AirRoute,
  returnDate: string
}

interface BookingComplete {
  kind: 'complete',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight,
  inboundTimetableFlight: TimetableFlight,
  inboundFlight: Flight
}

export type BookingState = BookingStart | BookingOrigin | BookingDestination | BookingDate | BookingFlight | BookingReturnDate | BookingComplete;

// A set of functions to allow us to go backwards in the state

export function toBookingStart(state: BookingState): BookingStart {
  if (state.kind !== 'start') {
    return { kind: 'start' };
  } else {
    throw new Error(`Cannot select start state from start`);
  }
}

export function toBookingOrigin(state: BookingState): BookingOrigin {
  switch (state.kind) {
    case 'destination':
    case 'date':
      return { kind: 'origin', origin: state.route.origin };
    case 'flight':
    case 'return-date':
    case 'complete':
      return { kind: 'origin', origin: state.outboundTimetableFlight.route.origin };
    default:
      throw new Error(`Cannot select origin state from ${state.kind}`);
  }
}

export function toBookingDestination(state: BookingState): BookingDestination {
  switch (state.kind) {
    case 'date':
      return { kind: 'destination', route: state.route };
    case 'flight':
    case 'return-date':
    case 'complete':
      return { kind: 'destination', route: state.outboundTimetableFlight.route };
    default:
      throw new Error(`Cannot select destination state from ${state.kind}`);
  }
}

export function toBookingDate(state: BookingState): BookingDate {
  switch (state.kind) {
    case 'flight':
    case 'return-date':
    case 'complete':
      return { kind: 'date', route: state.outboundTimetableFlight.route, date: state.outboundFlight.date };
    default:
      throw new Error(`Cannot select date state from ${state.kind}`);
  }
}

export function toBookingFlight(state: BookingState): BookingFlight {
  switch (state.kind) {
    case 'return-date':
      return { kind: 'flight', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, inboundRoute: state.inboundRoute };
    case 'complete':
      return { kind: 'flight', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, inboundRoute: state.inboundTimetableFlight.route };
    default:
      throw new Error(`Cannot select flight state from ${state.kind}`);
  }
}

export function toBookingReturnDate(state: BookingState): BookingReturnDate {
  switch (state.kind) {
    case 'complete':
      return { kind: 'return-date', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, inboundRoute: state.inboundTimetableFlight.route, returnDate: state.inboundFlight.date };
    default:
      throw new Error(`Cannot select booking return state from ${state.kind}`);
  }
}
