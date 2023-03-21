import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Observable, map } from 'rxjs';
import { addDays, formatISOWithOptions } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Airport, cityName, isAirport, maximumBookingDay, startOfDayInTimezone, timezone } from '@marlborough/model';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-departure-date-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatNativeDateModule, MatDatepickerModule, CityNamePipe],
  templateUrl: './choose-departure-date-page.component.html',
  styleUrls: ['./choose-departure-date-page.component.scss']
})
export class ChooseDepartureDatePageComponent {
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  vm$: Observable<{ origin: Airport; destination: Airport; earliest: Date; latest: Date }> =
    this._route.paramMap.pipe(
      map(p => {
        const origin = p.get('origin');
        const destination = p.get('destination');
        if (origin && isAirport(origin) && destination && isAirport(destination)) {
          const originTimeZone = timezone(origin);
          // the local date of the user does not count - only the current time at the origin
          // we want starting tomorrow as too hard to determine what remains of today
          const earliest = addDays(1, startOfDayInTimezone(originTimeZone, new Date()));
          const latest = addDays(maximumBookingDay, earliest);
          return {
            origin: origin,
            destination: destination,
            earliest: earliest,
            latest: latest
          };
        } else {
          throw Error('Something funny going on with the route parameters')
        }
      })
    );

  dateSelected(origin: Airport, destination: Airport, date: Date) {
    const datestring = formatISOWithOptions({ representation: 'date' }, date);
    this._router.navigateByUrl(`flights?origin=${origin}&destination=${destination}&date=${datestring}`);
  }
}
