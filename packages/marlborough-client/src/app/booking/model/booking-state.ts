import { Airport, AirRoute, Flight, FlightBooking, Ticket, TimetableFlight } from "@marlborough/model";

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

interface NominalBookingDate {
  kind: 'nominal_date',
  route: AirRoute,
  nominalDate: string
}

interface OneWayBookingSelected {
  kind: 'one_way_selected',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight
}

interface NominalBookingReturnDate {
  kind: 'nominal_return_date',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight,
  nominalReturnDate: string
}

interface ReturnBookingSelected {
  kind: 'return_selected',
  outboundTimetableFlight: TimetableFlight,
  outboundFlight: Flight,
  inboundTimetableFlight: TimetableFlight,
  inboundFlight: Flight
}

export type BookingState = BookingStart | BookingOrigin | BookingDestination | NominalBookingDate | OneWayBookingSelected | NominalBookingReturnDate | ReturnBookingSelected;

export function startBooking(): BookingState {
  return { kind: 'start' };
}

export function addOrigin(state: BookingState, origin: Airport): BookingState {
  if (state.kind === 'start') {
    return { kind: 'origin', origin: origin };
  } else {
    throw new Error(`Cannot create origin state from ${state.kind}`);
  }
}

export function addDestination(state: BookingState, route: AirRoute): BookingState {
  if (state.kind === 'origin') {
    if (route.origin === state.origin) {
      return { kind: 'destination', route: route };
    } else {
      throw new Error(`State origin ${state.origin} does not match route origin ${route.origin}`);
    }
  } else {
    throw new Error(`Cannot create destination state from ${state.kind}`);
  }
}

export function addDate(state: BookingState, date: string): BookingState {
  if (state.kind === 'destination') {
    return { kind: 'nominal_date', route: state.route, nominalDate: date };
  } else {
    throw new Error(`Cannot create date state from ${state.kind}`);
  }
}

export function selectOneWayBooking(state: BookingState, outboundTimetableFlight: TimetableFlight, outboundFlight: Flight): BookingState {
  if (state.kind === 'nominal_date') {
    if (state.route.origin === outboundTimetableFlight.route.origin && state.route.destination === outboundTimetableFlight.route.destination) {
      return { kind: 'one_way_selected', outboundTimetableFlight: outboundTimetableFlight, outboundFlight: outboundFlight };
    } else {
      throw new Error(`State route ${state.route.origin} -> ${state.route.destination} does not match outbound timetable flight route ${outboundTimetableFlight.route.origin} -> ${outboundTimetableFlight.route.destination}`);
    }
  } else {
    throw new Error(`Cannot create oneway booking state from ${state.kind}`);
  }
}

export function addReturnDate(state: BookingState, returnDate: string): BookingState {
  if (state.kind === 'one_way_selected') {
    return { kind: 'nominal_return_date', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, nominalReturnDate: returnDate };
  } else {
    throw new Error(`Cannot create return date state from ${state.kind}`);
  }
}

export function selectReturnBooking(state: BookingState, inboundTimetableFlight: TimetableFlight, inboundFlight: Flight): BookingState {
  if (state.kind === 'nominal_return_date') {
    if (state.outboundTimetableFlight.route.origin === inboundTimetableFlight.route.destination && state.outboundTimetableFlight.route.destination === inboundTimetableFlight.route.origin) {
      return { kind: 'return_selected', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, inboundTimetableFlight: inboundTimetableFlight, inboundFlight: inboundFlight };
    } else {
      throw new Error(`State outbound  route ${state.outboundTimetableFlight.route.origin} -> ${state.outboundTimetableFlight.route.destination} does not match inbound route ${inboundTimetableFlight.route.origin} -> ${inboundTimetableFlight.route.destination}`);
    }
  } else {
    throw new Error(`Cannot create return selected state from ${state.kind}`);
  }
}

// A set of functions to allow us to go backwards in the state
export function backToBookingStart(state: BookingState): BookingStart {
  if (state.kind !== 'start') {
    return { kind: 'start' };
  } else {
    throw new Error(`Cannot select start state from start`);
  }
}

export function backToBookingOrigin(state: BookingState): BookingOrigin {
  switch (state.kind) {
    case 'destination':
    case 'nominal_date':
      return { kind: 'origin', origin: state.route.origin };
    case 'one_way_selected':
    case 'nominal_return_date':
    case 'return_selected':
      return { kind: 'origin', origin: state.outboundTimetableFlight.route.origin };
    default:
      throw new Error(`Cannot select origin state from ${state.kind}`);
  }
}

export function backToBookingDestination(state: BookingState): BookingDestination {
  switch (state.kind) {
    case 'nominal_date':
      return { kind: 'destination', route: state.route };
    case 'one_way_selected':
    case 'nominal_return_date':
    case 'return_selected':
      return { kind: 'destination', route: state.outboundTimetableFlight.route };
    default:
      throw new Error(`Cannot select destination state from ${state.kind}`);
  }
}

export function backToBookingDate(state: BookingState): NominalBookingDate {
  switch (state.kind) {
    case 'one_way_selected':
    case 'nominal_return_date':
    case 'return_selected':
      return { kind: 'nominal_date', route: state.outboundTimetableFlight.route, nominalDate: state.outboundFlight.date };
    default:
      throw new Error(`Cannot select date state from ${state.kind}`);
  }
}

export function backToBookingReturnDate(state: BookingState): NominalBookingReturnDate {
  switch (state.kind) {
    case 'return_selected':
      return { kind: 'nominal_return_date', outboundTimetableFlight: state.outboundTimetableFlight, outboundFlight: state.outboundFlight, nominalReturnDate: state.inboundFlight.date };
    default:
      throw new Error(`Cannot select booking return state from ${state.kind}`);
  }
}

export function createBooking(state: BookingState, tickets: Ticket[]): FlightBooking {
  switch (state.kind) {
    case 'one_way_selected':
      return {
        kind: 'oneWay',
        date: state.outboundFlight.date,
        flightNumber: state.outboundFlight.flightNumber,
        tickets: tickets
      };
    case 'return_selected':
      return {
        kind: 'return',
        outboundDate: state.outboundFlight.date,
        outboundFlightNumber: state.outboundFlight.flightNumber,
        inboundDate: state.inboundFlight.date,
        inboundFlightNumber: state.inboundFlight.flightNumber,
        tickets: tickets
      }
    default:
      throw new Error(`Cannot create booking from ${state.kind}`);
  }
}
