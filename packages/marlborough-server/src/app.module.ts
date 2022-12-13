import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirRoutesController } from './air-routes/airRoutes.controller';
import { ScheduleService } from './schedule/schedule.service';

@Module({
  imports: [],
  controllers: [AppController, AirRoutesController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
