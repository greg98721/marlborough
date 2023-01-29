import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Observable, map } from 'rxjs';
import { addDays, formatISO } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Airport, cityName, isAirport, maximumBookingDay, startOfDayInTimezone, timezone } from '@marlborough/model';

@Component({
  selector: 'app-choose-departure-date-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatNativeDateModule, MatDatepickerModule],
  templateUrl: './choose-departure-date-page.component.html',
  styleUrls: ['./choose-departure-date-page.component.scss']
})
export class ChooseDepartureDatePageComponent {
  vm$ = this.create_vm$();

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  dateSelected(origin: Airport, destination: Airport, date: Date) {
    const datestring = formatISO(date);
    this._router.navigateByUrl(`flights?origin=${origin}&destination=${destination}&date=${datestring}`);
  }

  create_vm$(): Observable<{ origin: { code: Airport; cityName: string }; destination: { code: Airport; cityName: string }; earliest: Date; latest: Date}> {
    return this._route.paramMap.pipe(
      map(p => {
        const origin = p.get('origin');
        const destination = p.get('destination');
        if (origin && isAirport(origin) && destination && isAirport(destination)) {
          const originName = cityName(origin);
          const destinationName = cityName(destination);
          const originTimeZone = timezone(origin);
          // the local date of the user does not count - only the current time at the origin
          // we want starting tomorrow as too hard to determin what remains of today
          const earliest = addDays(1, startOfDayInTimezone(originTimeZone, new Date()));
          const latest = addDays(maximumBookingDay, earliest);
          return { origin: { code: origin, cityName: originName }, destination: { code: destination, cityName: destinationName }, earliest:  earliest, latest: latest };
        } else {
          throw Error('Something funny going on with the route parameters')
        }
      })
    );
  }
}
