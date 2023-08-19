import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Airport, Flight, TimetableFlight } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { FlightService } from "../data-access/flight.service";
import { LoadingService } from 'src/app/shared/services/loading.service';


export const resolveFlights: ResolveFn<{ origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selectedDate: string }> =
  (
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot,
    flightService = inject(FlightService),
    loadingService = inject(LoadingService)
  ): Observable<{ origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selectedDate: string }> => {
    const origin = route.queryParamMap.get('origin');
    const destination = route.queryParamMap.get('destination');
    const selectedDate = route.queryParamMap.get('date');
    if (origin && destination && selectedDate) {
      // this API call is not cached so will need the twirly whirly
      return loadingService.setLoadingWhile$(flightService.getFlights$(origin, destination)).pipe(
        map(f => {
          const o = origin as Airport;
          return { origin: o, flights: f, selectedDate: selectedDate }
        })
      );
    } else {
      throw new Error('No origin and/or destination when navigating to flights');
    }
  }
