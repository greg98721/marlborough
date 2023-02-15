import { Flight, TimetableFlight } from '@marlborough/model';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly _scheduleService: ScheduleService) {}

  @Get()
  getFlights(
    @Query('origin') origin: string,
    @Query('dest') dest: string,
  ): { timetableFlight: TimetableFlight; flights: Flight[] }[] {
    return this._scheduleService.flights(origin, dest);
  }

  @Get('toBook/:flightNumber/:date')
  getTimetable(
    @Param('flightNumber') flightNumber: string,
    @Param('date') date: string,
  ) {
    return this._scheduleService.flightToBook(flightNumber, date);
  }
}
