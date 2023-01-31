import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { parseISO, addDays, differenceInDays, isBefore, isAfter } from 'date-fns/fp'; // Note using the functional version of the date-fns library

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
        const gap = differenceInDays(earliest, selected);

        // we ant a five day selection around the selected date taking into account where the selected date is near one end of the possible range
        let start: Date;
        if (gap < 3) {
          start = earliest;
        } else if (gap > (maximumBookingDay - 3)) {
          start = addDays(maximumBookingDay - 5, earliest);
        } else {
          start = addDays(-2, selected);
        }
        const end = addDays(5, start);
        const withinRange = allflights.flights.map(f => {
          const within = f.flights.filter(w => isBetween(w.date, start, end));
          return { timetableFlight: f.timetableFlight, flights: within };
        });
        const filtered = withinRange.filter(f => f.flights.length > 0);
        return { origin: allflights.origin, flights: filtered, selected: selected };
      }));
}

function isBetween(x: Date, a: Date, b: Date): boolean {
  const r = isAfter(x, a) && isBefore(x, b);
  return r;
}
