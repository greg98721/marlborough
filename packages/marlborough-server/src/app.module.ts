import { Module } from '@nestjs/common';
import { AirRoutesController } from './air-routes/airRoutes.controller';
import { ScheduleService } from './schedule/schedule.service';
import { FlightsController } from './flights/flights.controller';

@Module({
  imports: [],
  controllers: [AirRoutesController, FlightsController],
  providers: [ ScheduleService],
})
export class AppModule {}
