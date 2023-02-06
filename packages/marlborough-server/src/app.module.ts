import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AirRoutesController } from './air-routes/airRoutes.controller';
import { ScheduleService } from './schedule/schedule.service';
import { FlightsController } from './flights/flights.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        'marlborough-client',
        'dist',
        'marlborough-client',
      ),
    }),
  ],
  controllers: [AirRoutesController, FlightsController],
  providers: [ScheduleService],
})
export class AppModule {}
