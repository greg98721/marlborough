import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Airport, Flight, TimetableFlight } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { FlightService } from "../data-access/flight.service";
import { LoadingService } from 'src/app/shared/services/loading.service';


@Injectable({ providedIn: 'root' })
export class FlightsResolver  {

  private _flightService = inject(FlightService);
  private _loadingService = inject(LoadingService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selectedDate: string}> {
    const origin = route.queryParamMap.get('origin');
    const destination = route.queryParamMap.get('destination');
    const selectedDate = route.queryParamMap.get('date');
    if (origin && destination && selectedDate) {
      // this API call is not cached so will need the twirly whirly
      return this._loadingService.setLoadingWhile$(this._flightService.getFlights$(origin, destination)).pipe(
        map(f => {
          const o = origin as Airport;
          return { origin: o, flights: f, selectedDate: selectedDate}
        })
      );
    } else {
      throw new Error('No origin and/or destination when navigating to flights');
    }
  }
}
