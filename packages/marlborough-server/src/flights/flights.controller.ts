import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getFlights(@Query('origin') origin: string, @Query('dest') dest: string) {
    return this.scheduleService.getFlights(origin, dest);
  }
}
