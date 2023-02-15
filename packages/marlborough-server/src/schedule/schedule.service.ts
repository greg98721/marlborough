import {
  Airport,
  Flight,
  isAirport,
  TimetableFlight,
} from '@marlborough/model';
import { Injectable } from '@nestjs/common';
import {
  createSchedule,
  getFlights,
  getOrigins,
  getRoutes,
  getTimetable,
  getTimetableFlight,
  Schedule,
} from '../model/schedule';

@Injectable()
export class ScheduleService {
  private _schedule: Schedule;

  constructor() {
    this._schedule = createSchedule();
  }

  origins() {
    return getOrigins(this._schedule);
  }

  routes(origin: string) {
    if (isAirport(origin)) {
      const o = origin as Airport;
      return getRoutes(this._schedule, o);
    } else {
      throw new TypeError(
        `Tried to convert a non valid airport code ${origin} when getting list of routes`,
      );
    }
  }

  timetable(origin: string) {
    if (isAirport(origin)) {
      const o = origin as Airport;
      return getTimetable(this._schedule, o);
    } else {
      throw new TypeError(
        `Tried to convert a non valid airport code ${origin} when getting list of timetables`,
      );
    }
  }

  flights(
    origin: string,
    destination: string,
  ): { timetableFlight: TimetableFlight; flights: Flight[] }[] {
    if (isAirport(origin) && isAirport(destination)) {
      const o = origin as Airport;
      const d = destination as Airport;
      return getFlights(this._schedule, o, d);
    } else {
      throw new TypeError(
        `Tried to convert a non valid airport code ${origin} and/or ${destination} when getting list of flights`,
      );
    }
  }

  flightToBook(flightNumber: string, dateOfFlight: string) {
    return getTimetableFlight(this._schedule, flightNumber, dateOfFlight);
  }
}
