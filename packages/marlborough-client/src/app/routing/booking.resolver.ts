import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Flight, TimetableFlight } from "@marlborough/model";
import { Observable } from "rxjs";
import { FlightService } from "../services/flight.service";
import { LoadingService } from "../services/loading.service";


@Injectable({ providedIn: 'root' })
export class BookingResolver implements Resolve<{ timetableFlight: TimetableFlight, flight: Flight }> {
  constructor(private _flightService: FlightService, private _loadingService: LoadingService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ timetableFlight: TimetableFlight, flight: Flight }> {
    const flightNumber = route.paramMap.get('flight');
    const dateOfFlight = route.paramMap.get('date');
    if (flightNumber && dateOfFlight) {
      return this._loadingService.setLoadingWhile$(this._flightService.getTimetableFlight$(flightNumber, dateOfFlight));
    } else {
      throw new Error('No flight number or date when navigating to booking');
    }
  }
}
