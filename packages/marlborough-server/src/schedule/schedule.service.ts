import { Airport, isAirport } from '@marlborough/model';
import { Injectable } from '@nestjs/common';
import {
  createSchedule,
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
      throw new Error('Tried to convert a non valid airport code');
    }
  }
}
