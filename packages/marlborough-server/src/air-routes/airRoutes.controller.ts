import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('routes')
export class AirRoutesController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getOrigins(): string {
    return this.scheduleService.getOrigins();
  }

  @Get(':origin')
  getRoutes(origin: string): string {
    return this.scheduleService.getRoutes(origin);
  }
}
