import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly _scheduleService: ScheduleService) {}

  @Get()
  getFlights(
    @Query('origin') origin: string,
    @Query('dest') dest: string,
    @Query('date') selectedDate: string,
  ) {
    return this._scheduleService.flights(origin, dest, selectedDate);
  }
}
