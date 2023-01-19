import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { TimetableFlight } from "@marlborough/model";
import { Observable } from "rxjs";
import { FlightService } from "../services/flight.service";
import { LoadingService } from "../services/loading.service";

@Injectable({ providedIn: 'root' })
export class TimetableResolver implements Resolve<TimetableFlight[]> {
  constructor(private flightService: FlightService, private loadingService: LoadingService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TimetableFlight[]> {
    const airport = route.paramMap.get('airport');
    if (airport) {
      return this.loadingService.setLoadingWhile(this.flightService.getTimetable(airport));
    } else {
      throw new Error('No origin when navigating to timetables');
    }
  }
}
