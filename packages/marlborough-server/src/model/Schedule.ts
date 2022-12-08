import { AirRoute, Flight, ScheduleFlight } from '@marlborough/model';
import { GenerationPlaceHolder } from './GenerationPlaceHolder';

export interface Schedule {
  routes: (ServerAirRoute | GenerationPlaceHolder)[];
}
export interface ServerAirRoute extends AirRoute {
  scheduledFlights: (ServerScheduleFlight | GenerationPlaceHolder)[];
}

export interface ServerScheduleFlight extends ScheduleFlight {
  flights: (ServerFlight | GenerationPlaceHolder)[];
}

export interface ServerFlight extends Flight {
  bookings: (ServerFlight | GenerationPlaceHolder)[];
}
