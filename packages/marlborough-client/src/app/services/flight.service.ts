import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Airport, Flight, FlightBookingSelection, isAirport, TimetableFlight } from '@marlborough/model';
import { Observable, map, catchError } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private _http: HttpClient, private _config: AppConfigService) { }

  getOrigins$(): Observable<Airport[]> {
    const url = this._config.apiUrl('routes');
    return this._http.get(url).pipe(
      map(response => {
        const rawList = response as string[];
        if (rawList.every(isAirport)) {
          // this is mainly to catch the server and client being out of synch in list of airports
          return rawList as Airport[];
        } else {
          throw new TypeError('Invalid airport in getting list of origins from server');
        }
      }),
      catchError(_ => []) // we have proper http error handling higher up the stack - for here keep things polite
    )
  }

  getTimetable$(origin: Airport): Observable<{ origin: Airport; timetable: TimetableFlight[]}> {
    const url = this._config.apiUrl(`routes/timetable/${origin}`);
    return this._http.get(url).pipe(
      map(response => {
        const rawList = response as any[];
        if (rawList.every(t => isAirport(t.route.destination) && isAirport(t.route.origin))) {
          // this is mainly to catch the server and client being out of synch in list of airports
          const timetable =  rawList as TimetableFlight[];
          return { origin: origin, timetable: timetable };
        } else {
          throw new TypeError(`Invalid airport in getting list of timetables for ${origin} from server`);
        }
      }),
      catchError(_ => []) // we have proper http error handling higher up the stack - for here keep things polite
    )
  }

  getFlights$(origin: string, destination: string, selectedDate: string): Observable<FlightBookingSelection> {
    const url = this._config.apiUrl(`flights?origin=${origin}&dest=${destination}`);
    return this._http.get(url).pipe(
      map(response => {
        const flights = response as FlightBookingSelection;
        if (flights.flights.every(t => isAirport(t.timetableFlight.route.destination) && isAirport(t.timetableFlight.route.origin))) {
          // this is mainly to catch the server and client being out of synch in list of airports
          return flights;
        } else {
          throw new TypeError(`Invalid airport in getting list of timetables for ${origin} from server`);
        }
      }),
      catchError(_ => []) // we have proper http error handling higher up the stack - for here keep things polite
    )
  }
}
