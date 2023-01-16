import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Airport, isAirport } from '@marlborough/model';
import { Observable, map, catchError } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private _http: HttpClient, private _config: AppConfigService) { }

  getOrigins(): Observable<Airport[]> {
    const url = this._config.apiUrl('routes');
    return this._http.get(url).pipe(
      map(response => {
        const rawList = response as string[];
        if (rawList.every(isAirport)) {
          // this is mainly to catch the server and client being out of synch in list of airports
          return rawList as Airport[];
        } else {
          throw new TypeError('Invalid airport in getting list from server');
        }
      }),
      catchError(_ => []) // we have proper http error handling higher up the stack - for here keep things polite
    )
  }
}
