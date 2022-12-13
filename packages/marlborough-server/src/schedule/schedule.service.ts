import { parseISO } from 'date-fns';
import { Airport, isAirport } from '@marlborough/model';
import { Injectable } from '@nestjs/common';
import {
  createSchedule,
  getFlights,
  getOrigins,
  getRoutes,
  Schedule,
} from '../model/schedule';

@Injectable()
export class ScheduleService {
  private _schedule: Schedule;

  constructor() {
    this._schedule = createSchedule();
  }

  getOrigins() {
    const airports = getOrigins(this._schedule);
    return JSON.stringify(airports);
  }

  getRoutes(origin: string) {
    if (isAirport(origin)) {
      const o = origin as Airport;
      const routes = getRoutes(this._schedule, o);
      return JSON.stringify(routes);
    } else {
      throw new TypeError(
        `Tried to convert a non valid airport code ${origin} when getting list of routes`,
      );
    }
  }

  getFlights(origin: string, destination: string, from: string, till: string) {
    if (isAirport(origin) && isAirport(destination)) {
      const o = origin as Airport;
      const d = destination as Airport;
      const f = parseISO(from);
      const t = parseISO(till);
      if (!(isNaN(f.valueOf()) || isNaN(t.valueOf()))) {
        const flights = getFlights(this._schedule, o, d, f, t);
        return JSON.stringify(flights);
      } else {
        throw new TypeError(
          `Tried to convert a non valid date ${from} and/or ${till} when getting list of flights`,
        );
      }
    } else {
      throw new TypeError(
        `Tried to convert a non valid airport code ${origin} and/or ${destination} when getting list of flights`,
      );
    }
  }
}
