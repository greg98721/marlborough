import { Airport, Flight, TimetableFlight } from '@marlborough/model';
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

  routes(origin: Airport) {
    return getRoutes(this._schedule, origin);
  }

  timetable(origin: Airport) {
    return getTimetable(this._schedule, origin);
  }

  flights(
    origin: Airport,
    destination: Airport,
  ): { timetableFlight: TimetableFlight; flights: Flight[] }[] {
    return getFlights(this._schedule, origin, destination);
  }

  flightToBook(flightNumber: string, dateOfFlight: string) {
    return getTimetableFlight(this._schedule, flightNumber, dateOfFlight);
  }
}
