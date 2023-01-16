import { Controller, Get, Param } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('routes')
export class AirRoutesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getOrigins() {
    return this.scheduleService.getOrigins();
  }

  @Get(':origin')
  getRoutes(@Param('origin') origin: string) {
    return this.scheduleService.getRoutes(origin);
  }
}
