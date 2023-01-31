import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { formatISOWithOptions, parseISO, addDays, differenceInCalendarDays, isBefore, isAfter, isEqual } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Airport, Flight, maximumBookingDay, startOfDayInTimezone, TimetableFlight, timezone } from '@marlborough/model';

@Component({
  selector: 'app-flights-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss']
})
export class FlightsPageComponent {
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  vm$: Observable<{ origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selected: Date }> =
    this._route.data.pipe(
      map(t => {
        const allflights = t['airport'] as { origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selectedDate: string };
        const originTimeZone = timezone(allflights.origin);
        const sel = parseISO(allflights.selectedDate);
        const selected = startOfDayInTimezone(originTimeZone, sel);
        const earliest = addDays(1, startOfDayInTimezone(originTimeZone, new Date()));
        const gap = differenceInCalendarDays(earliest, selected);

        // we ant a five day selection around the selected date taking into account where the selected date is near one end of the possible range
        let start: Date;
        let end: Date;
        if (gap < 3) {
          start = earliest;
          end = addDays(3 + gap, start);
        } else if (gap > (maximumBookingDay - 2)) {
          start = addDays(-2, selected);
          end = addDays(maximumBookingDay + 1, earliest);
        } else {
          start = addDays(-2, selected);
          end = addDays(5, start);
        }

        const withinRange = allflights.flights.map(f => {
          const within = f.flights.filter(w => {
            const flightDate = parseISO(w.date);
            return (isBefore(flightDate, start) || isEqual(flightDate, start)) && isBefore(end, flightDate);
          });
          return { timetableFlight: f.timetableFlight, flights: within };
        });
        const filtered = withinRange.filter(f => f.flights.length > 0);
        return { origin: allflights.origin, flights: filtered, selected: selected };
      }));
}
