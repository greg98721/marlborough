import {
  Airport,
  Flight,
  isAirport,
  TimetableFlight,
} from '@marlborough/model';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from '../schedule/schedule.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly _scheduleService: ScheduleService) {}

  @Get()
  getFlights(
    @Query('origin') origin: string,
    @Query('dest') destination: string,
  ): { timetableFlight: TimetableFlight; flights: Flight[] }[] {
    if (isAirport(origin) && isAirport(destination)) {
      const o = origin as Airport;
      const d = destination as Airport;
      return this._scheduleService.flights(o, d);
    } else {
      throw new HttpException(
        `Tried to convert a non valid airport code ${origin} and/or ${destination} when getting list of flights`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('toBook/:flightNumber/:date')
  getTimetable(
    @Param('flightNumber') flightNumber: string,
    @Param('date') date: string,
  ) {
    return this._scheduleService.flightToBook(flightNumber, date);
  }
}
