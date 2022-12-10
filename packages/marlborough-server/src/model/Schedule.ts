import { addDays, differenceInCalendarDays } from 'date-fns';

import {
  Aircraft,
  AirRoute,
  capacity,
  decimalHourToPlainTime,
  Flight,
  getTimetableDayFromDate,
  PlainDate,
  TimetableFlight,
  WEEKDAYS,
  WEEKEND,
} from '@marlborough/model';
import { PsuedoRandom } from './psuedoRandom';

export interface Schedule {
  routes: ServerAirRoute[];
  randomSeed: string;
}
export interface ServerAirRoute extends AirRoute {
  timetableFlights: ServerTimetableFlight[] | undefined;
  intensity: 1 | 2 | 3;
  distance: number;
  flightNumberBlock: number;
  randomSeed: string;
}

export interface ServerTimetableFlight extends TimetableFlight {
  flights: ServerFlight[] | undefined;
  /** array of all the days flights have been inflated */
  inflated: number[];
  randomSeed: string;
}

export interface ServerFlight extends Flight {
  /** Only the manually added ones - simulate with EmptySeats field otherwise */
  bookings: ServerFlight[];
  randomSeed: string;
}

export function createSchedule(): Schedule {
  const seed = 'marlborough';
  const rnd = new PsuedoRandom(seed);
  const schedule = { routes: createRoutes(rnd), randomSeed: seed };
  return schedule;
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
  const randomSeed = rnd.nextSeed();

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
    case 2:
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
    const flightNumber = `MA${currentFlightNumber.toFixed(3)}`;
    currentFlightNumber++;

    return {
      route: baseRoute,
      aircraft: aircraft,
      flightNumber: flightNumber,
      departs: departs,
      arrives: arrives,
      days: days,
      flights: undefined,
      inflated: [],
      randomSeed: randomSeed,
    };
  });
}

function createFlight(
  timetableFlight: ServerTimetableFlight,
  days: number[],
): ServerFlight[] {
  const rnd = new PsuedoRandom(timetableFlight.randomSeed);
  const start = new Date(2022, 1, 1);
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
      dayOfFlight - differenceInCalendarDays(start, new Date());
    if (daysTillFlight > 42) {
      bookedPercent = 0;
    } else if (daysTillFlight > 0) {
      bookedPercent = (bookedPercent * dayOfFlight) / 42;
    }
    bookedPercent = bookedPercent > 1.0 ? 1.0 : bookedPercent;
    return (1 - bookedPercent) * capacity(timetableFlight.aircraft);
  };

  return days
    .filter((n) => {
      // first filter the days when there is no flight
      const d = addDays(start, n);
      const t = getTimetableDayFromDate(d);
      return (t & timetableFlight.days) > 0;
    })
    .map((n) => {
      return {
        flightNumber: timetableFlight.flightNumber,
        date: n,
        emptySeats: createEmptySeats(n),
        departed: undefined,
        arrived: undefined,
        bookings: [],
        randomSeed: rnd.nextSeed(),
      };
    });
}
