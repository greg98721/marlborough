import { Injectable, inject } from "@angular/core";
import { eachDayOfInterval, formatISOWithOptions, parseISO, addDays, differenceInCalendarDays, isBefore, isSameDay, isEqual } from 'date-fns/fp'; // Note using the functional version of the date-fns library
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Airport, EMPTY_FLIGHT, Flight, TimetableFlight, maximumBookingDay, startOfDayInTimezone, timezone } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { FlightService } from "../data-access/flight.service";
import { LoadingService } from 'src/app/shared/services/loading.service';


export const resolveFlights: ResolveFn<{ origin: Airport, destination: Airport, flightData: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selected: number, dayRange: Date[] }> =
  (
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot,
    flightService = inject(FlightService),
    loadingService = inject(LoadingService)
  ) => {
    const origin = route.queryParamMap.get('origin');
    const destination = route.queryParamMap.get('destination');
    const selectedDate = route.queryParamMap.get('date');
    if (origin && destination && selectedDate) {
      // this API call is not cached so will need the twirly whirly
      return loadingService.setLoadingWhile$(flightService.getFlights$(origin, destination)).pipe(
        map(f => {
          const o = origin as Airport;
          // return { origin: o, flights: f, selectedDate: selectedDate }

          const originTimeZone = timezone(o);
          const sel = parseISO(selectedDate);
          const selected = startOfDayInTimezone(originTimeZone, sel);
          const earliest = addDays(1, startOfDayInTimezone(originTimeZone, new Date()));
          const destination = f[0]?.timetableFlight.route.destination;

          // we ant a five day selection around the selected date taking into account where the selected date is near one end of the possible range
          const gap = differenceInCalendarDays(earliest, selected);
          let dayRange: Date[];
          let selIndex: number;
          if (gap < 3) {
            dayRange = eachDayOfInterval({ start: earliest, end: addDays(4, earliest) })
            selIndex = gap;
          } else if (gap > (maximumBookingDay - 2)) {
            dayRange = eachDayOfInterval({ start: addDays(maximumBookingDay - 4, earliest), end: addDays(maximumBookingDay, earliest) })
            selIndex = gap - maximumBookingDay + 4;
          } else {
            dayRange = eachDayOfInterval({ start: addDays(-2, selected), end: addDays(+2, selected) })
            selIndex = 2;
          }

          if (dayRange.length !== 5) {
            throw new Error(`Did not create valid day range - length = ${dayRange.length}`);
          }

          const withinRange = f.map(f => {
            const parsed = f.flights.map(p => ({ date: parseISO(p.date), flight: p }));
            const filtered = dayRange.map(d => parsed.find(p => isSameDay(p.date, d))?.flight ?? EMPTY_FLIGHT);
            return { timetableFlight: f.timetableFlight, flights: filtered };
          });
          const filtered = withinRange.filter(f => f.flights.filter(l => l.flightNumber !== '').length > 0);
          const sorted = filtered.sort((a, b) => (a.timetableFlight.departs - b.timetableFlight.departs));
          return { origin: o, destination: destination, flightData: sorted, selected: selIndex, dayRange: dayRange };

        })
      );
    } else {
      throw new Error('No origin and/or destination when navigating to flights');
    }
  }
