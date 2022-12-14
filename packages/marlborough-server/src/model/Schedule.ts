import { addDays, differenceInCalendarDays } from 'date-fns';

import {
  Aircraft,
  Airport,
  AirRoute,
  calendarStart,
  capacity,
  decimalHourToPlainTime,
  Flight,
  getTimetableDayFromDate,
  TimetableFlight,
  WEEKDAYS,
  WEEKEND,
} from '@marlborough/model';
import { PsuedoRandom } from './psuedoRandom';

export interface Schedule {
  routes: ServerAirRoute[];
  randomSeed: string;
}
interface ServerAirRoute extends AirRoute {
  timetableFlights: ServerTimetableFlight[] | undefined;
  intensity: 1 | 2 | 3;
  distance: number;
  flightNumberBlock: number;
  randomSeed: string;
}

function asAirRoute(s: ServerAirRoute): AirRoute {
  return {
    origin: s.origin,
    destination: s.destination,
  };
}

interface ServerTimetableFlight extends TimetableFlight {
  flights: ServerFlight[];
  randomSeed: string;
}

function asTimetableFlight(s: ServerTimetableFlight): TimetableFlight {
  return {
    route: s.route,
    aircraft: s.aircraft,
    flightNumber: s.flightNumber,
    departs: s.departs,
    arrives: s.arrives,
    days: s.days,
  };
}
interface ServerFlight extends Flight {
  /** Only the manually added ones - simulate with EmptySeats field otherwise */
  bookings: ServerFlight[];
  randomSeed: string;
}

function asFlight(s: ServerFlight): Flight {
  return {
    flightNumber: s.flightNumber,
    date: s.date,
    emptySeats: s.emptySeats,
    departed: s.departed,
    arrived: s.arrived,
  };
}

export function createSchedule(): Schedule {
  const seed = 'marlborough';
  const rnd = new PsuedoRandom(seed);
  const schedule = { routes: createRoutes(rnd), randomSeed: seed };
  return schedule;
}

/** Get the list of actual origin airports for which there are routes */
export function getOrigins(schedule: Schedule): Airport[] {
  // the Set makes the list of origins unique
  const unique = [...new Set(schedule.routes.map((r) => r.origin))];
  return unique.sort();
}

export function getRoutes(schedule: Schedule, origin: Airport): AirRoute[] {
  return schedule.routes
    .filter((r) => r.origin === origin)
    .map((r) => {
      return asAirRoute(r);
    });
}

export function getTimetable(
  schedule: Schedule,
  origin: Airport,
): TimetableFlight[] {
  // this function has side effects as we made need to inflate the list of timetable flights for each route
  return schedule.routes
    .filter((r) => r.origin === origin)
    .flatMap((r) => {
      if (r.timetableFlights === undefined) {
        r.timetableFlights = createTimetableFlights(r);
      }
      return r.timetableFlights.map((t) => asTimetableFlight(t));
    });
}

export function getFlights(
  schedule: Schedule,
  origin: Airport,
  destination: Airport,
  from: Date,
  till: Date,
): { t: TimetableFlight; f: Flight[] }[] {
  const route = schedule.routes.find(
    (r) => r.origin === origin && r.destination === destination,
  );
  const fn = differenceInCalendarDays(from, calendarStart);
  const tn = differenceInCalendarDays(till, calendarStart);
  const days = Array.from({ length: tn - fn + 1 }, (_, i) => fn + i);
  if (route !== undefined) {
    if (route.timetableFlights === undefined) {
      route.timetableFlights = createTimetableFlights(route);
    }
    return route.timetableFlights
      .map((t) => {
        const flights = createFlight(t, days).map((f) => asFlight(f));
        return { t: asTimetableFlight(t), f: flights };
      })
      .filter((d) => d.f.length > 0);
  } else {
    return [];
  }
}

function createRoutes(rnd: PsuedoRandom): ServerAirRoute[] {
  const oneWay: ServerAirRoute[] = [
    {
      origin: 'NZWB',
      destination: 'NZWN',
      distance: 83,
      timetableFlights: undefined,
      intensity: 3,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWB',
      destination: 'NZCH',
      distance: 250,
      timetableFlights: undefined,
      intensity: 3,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZCH',
      destination: 'NZDN',
      distance: 313,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZCH',
      destination: 'NZQN',
      distance: 313,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWB',
      destination: 'NZHK',
      distance: 272,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZCH',
      destination: 'NZHK',
      distance: 150,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWB',
      destination: 'NZPM',
      distance: 187,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWB',
      destination: 'NZAA',
      distance: 507,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZAA',
      distance: 501,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZWN',
      distance: 133,
      timetableFlights: undefined,
      intensity: 3,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZCH',
      distance: 247,
      timetableFlights: undefined,
      intensity: 3,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZQN',
      distance: 547,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZHK',
      distance: 239,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZPM',
      distance: 228,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZNP',
      distance: 264,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZTG',
      distance: 477,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZNR',
      distance: 371,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZNS',
      destination: 'NZDN',
      distance: 555,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZCH',
      distance: 305,
      timetableFlights: undefined,
      intensity: 3,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZAA',
      distance: 482,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZQN',
      distance: 640,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZDN',
      distance: 615,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZNP',
      distance: 264,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZNR',
      distance: 271,
      timetableFlights: undefined,
      intensity: 2,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
    {
      origin: 'NZWN',
      destination: 'NZTG',
      distance: 423,
      timetableFlights: undefined,
      intensity: 1,
      flightNumberBlock: 0,
      randomSeed: rnd.nextSeed(),
    },
  ];

  // create the flight number blocks sequentially in blocks of 20
  let fn = 0;
  oneWay.forEach((o) => {
    o.flightNumberBlock = fn;
    fn += 20;
  });

  // now create return route for the outbound ones declared first
  const otherWay: ServerAirRoute[] = oneWay.map((o) => {
    return {
      origin: o.destination,
      destination: o.origin,
      distance: o.distance,
      timetableFlights: undefined,
      intensity: o.intensity,
      flightNumberBlock: o.flightNumberBlock + 10,
      randomSeed: rnd.nextSeed(),
    };
  });
  return oneWay.concat(otherWay);
}

function createTimetableFlights(
  route: ServerAirRoute,
): ServerTimetableFlight[] {
  const rnd = new PsuedoRandom(route.randomSeed);

  const baseRoute: AirRoute = {
    origin: route.origin,
    destination: route.destination,
  };

  let aircraft: Aircraft = 'ATR42';
  /** Only if both the origin and the destination are in this list will the A220 be used */
  const a220Airports = ['NZAA', 'NZCH', 'NZDN', 'NZQN', 'NZWN'];
  if (
    a220Airports.includes(route.origin) &&
    a220Airports.includes(route.destination)
  ) {
    aircraft = 'A220-100';
  }
  const speed = aircraft === 'ATR42' ? 500 : 800;
  const flightTime = route.distance / speed + 0.4; // the 0.4 is landing taxying etc.

  let currentFlightNumber = route.flightNumberBlock;

  const depatureTimes: [number, number][] = []; // day, decimal hour

  const divideDay = (days: number, n: number, fromT: number, toT: number) => {
    if (n === 0) {
      return;
    }
    for (let i = 0; i < n; i++) {
      const h0 = (i * (toT - fromT)) / n + fromT;
      const h1 = h0 + (toT - fromT) / n;
      const h = rnd.gaussian(h0, h1);
      depatureTimes.push([days, h]);
    }
  };

  switch (route.intensity) {
    case 1:
      // Intensity 1: Every week day and maybe weekends - 1 or 2 flights per day
      const wd1 = rnd.withinPrecent(70) ? 2 : 1;
      divideDay(WEEKDAYS, wd1, 8, 19);

      const we1 = rnd.withinPrecent(50) ? 1 : 0;
      divideDay(WEEKEND, we1, 9, 15);
      break;
    case 2:
      // Intensity 2: Every day - 3 to 5 flights per weekday 2 to 3 per weekend
      const wd2 = rnd.flatInt(3, 5);
      divideDay(WEEKDAYS, wd2, 7, 21);

      const we2 = rnd.flatInt(2, 3);
      divideDay(WEEKEND, we2, 9, 17);
      break;
    case 3:
      // Intensity 3: Every day - 5 to 8 flights per weekday 3 to 6 per weekend - evenly spaced
      const wd3 = rnd.flatInt(5, 8);
      divideDay(WEEKDAYS, wd3, 6, 23);

      const we3 = rnd.flatInt(3, 6);
      divideDay(WEEKEND, we3, 8, 20);
      break;
  }

  return depatureTimes.map((t) => {
    const days = t[0];
    const h = t[1];
    const departs = decimalHourToPlainTime(h, 5);
    const arrives = decimalHourToPlainTime(h + flightTime, 1);
    const flightNumber = `MA${currentFlightNumber.toString().padStart(3, '0')}`;
    currentFlightNumber++;

    return {
      route: baseRoute,
      aircraft: aircraft,
      flightNumber: flightNumber,
      departs: departs,
      arrives: arrives,
      days: days,
      flights: [],
      inflated: [],
      randomSeed: rnd.nextSeed(),
    };
  });
}

function createFlight(
  timetableFlight: ServerTimetableFlight,
  days: number[],
): ServerFlight[] {
  const rnd = new PsuedoRandom(timetableFlight.randomSeed);
  const createEmptySeats = (dayOfFlight: number) => {
    // TODO calculate number of seats booked - depends on how soon is the flight - size of flight and rush hour
    // use a sin curve for bookings over the 6 weeks before the flight
    let bookedPercent;
    // adjust relative to time of day
    switch (timetableFlight.departs.hour) {
      case 7:
      case 8:
      case 16:
      case 17:
        bookedPercent = rnd.flat(0.85, 1.3); // greater than 100% as to emulate booked out long way ahead
        break;
      case 6:
      case 9:
      case 15:
      case 18:
      case 19:
        bookedPercent = rnd.flat(0.7, 1.05);
        break;
      default:
        bookedPercent = rnd.flat(0.4, 0.75);
        break;
    }
    const daysTillFlight =
      dayOfFlight - differenceInCalendarDays(new Date(), calendarStart);
    if (daysTillFlight > 42) {
      bookedPercent = 0;
    } else if (daysTillFlight > 0) {
      bookedPercent = (bookedPercent * (42 - daysTillFlight)) / 42;
    }
    bookedPercent = bookedPercent > 1.0 ? 1.0 : bookedPercent;
    return Math.floor((1 - bookedPercent) * capacity(timetableFlight.aircraft));
  };

  return days
    .filter((n) => {
      // first filter the days when there is no flight
      const d = addDays(calendarStart, n);
      const t = getTimetableDayFromDate(d);
      return (t & timetableFlight.days) > 0;
    })
    .map((n) => {
      const existing = timetableFlight.flights.find((f) => f.date === n);
      if (existing !== undefined) {
        return existing;
      } else {
        return {
          flightNumber: timetableFlight.flightNumber,
          date: n,
          emptySeats: createEmptySeats(n),
          departed: undefined,
          arrived: undefined,
          bookings: [],
          randomSeed: rnd.nextSeed(),
        };
      }
    });
}
