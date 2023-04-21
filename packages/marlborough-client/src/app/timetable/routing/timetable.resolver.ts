import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Airport, isAirport, TimetableFlight } from "@marlborough/model";
import { Observable } from "rxjs";
import { FlightService } from "../services/flight.service";
import { LoadingService } from 'src/app/common/services/loading.service';

@Injectable({ providedIn: 'root' })
export class TimetableResolver implements Resolve<{ origin: Airport; timetable: TimetableFlight[] }> {

  private _flightService = inject(FlightService);
  private _loadingService = inject(LoadingService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ origin: Airport; timetable: TimetableFlight[]}> {
    const origin = route.paramMap.get('origin');
    if (origin && isAirport(origin)) {
      return this._loadingService.setLoadingWhile$(this._flightService.getTimetable$(origin as Airport));
    } else {
      throw new Error('No origin when navigating to timetables');
    }
  }
}
