import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Airport, cityName, isAirport, TimetableFlight } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { FlightService } from "../data-access/flight.service";
import { LoadingService } from 'src/app/shared/services/loading.service';

export const resolveTimetables: ResolveFn<{ origin: Airport, timetables: { destination: Airport; destinationTimetables: TimetableFlight[] }[] }> =
  (
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot,
    flightService = inject(FlightService),
    loadingService = inject(LoadingService)
  ): Observable<{ origin: Airport, timetables: { destination: Airport; destinationTimetables: TimetableFlight[] }[] }> => {
    const origin = route.paramMap.get('origin');

    if (origin && isAirport(origin)) {
      return loadingService.setLoadingWhile$(flightService.getTimetable$(origin as Airport).pipe(
        map(r => {
          // get the unique destinations
          const allDestinations = r.timetable.map(t => t.route.destination);
          const uniqueDestinations = [...new Set(allDestinations)];
          const sortedDestinations = uniqueDestinations.sort((a, b) => cityName(a).localeCompare(cityName(b)));

          const perDestinations = sortedDestinations.map(dest => {
            const s = r.timetable.filter(t => t.route.destination === dest).sort((a, b) => a.departs >= b.departs ? 1 : -1);
            return { destination: dest, destinationTimetables: s };
          }).sort((a, b) => cityName(a.destination).localeCompare(cityName(b.destination)));
          return { origin: origin, timetables: perDestinations };
        }
        )));
    } else {
      throw new Error('No origin when navigating to timetables');
    }
  }
