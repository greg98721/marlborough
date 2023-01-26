import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Flight, TimetableFlight } from "@marlborough/model";
import { Observable } from "rxjs";
import { FlightService } from "../services/flight.service";
import { LoadingService } from "../services/loading.service";


@Injectable({ providedIn: 'root' })
export class FlightsResolver implements Resolve<{ timetableFlight: TimetableFlight; flights: Flight[] }[]> {
  constructor(private _flightService: FlightService, private _loadingService: LoadingService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ timetableFlight: TimetableFlight; flights: Flight[] }[]> {
    const origin = route.paramMap.get('origin');
    const destination = route.paramMap.get('destination');
    if (origin && destination) {
      // this API call is not cached so will need the twirly whirly
      return this._loadingService.setLoadingWhile$(this._flightService.getFlights$(origin, destination));
    } else {
      throw new Error('No origin and/or destination when navigating to flights');
    }
  }
}
