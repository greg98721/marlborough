import { Controller, Get, Header, Param } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('routes')
export class AirRoutesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @Header('Cache-Control', 'max-age=3600')
  getOrigins() {
    return this.scheduleService.getOrigins();
  }

  @Get(':origin')
  @Header('Cache-Control', 'max-age=3600')
  getRoutes(@Param('origin') origin: string) {
    return this.scheduleService.getRoutes(origin);
  }

  @Get('timetable/:origin')
  @Header('Cache-Control', 'max-age=3600')
  getTimetable(@Param('origin') origin: string) {
    return this.scheduleService.getTimetable(origin);
  }
}
