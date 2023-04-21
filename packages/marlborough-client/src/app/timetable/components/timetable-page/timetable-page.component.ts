import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { addMinutes, format } from 'date-fns/fp';
import { Observable, map } from 'rxjs';
import { Airport, cityName, isAirport, TimetableFlight } from '@marlborough/model';
import { WeekDisplayComponent } from 'src/app/common/components/week-display/week-display.component';
import { MinutePipe } from 'src/app/common/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-timetable-page',
  standalone: true,
  imports: [CommonModule, WeekDisplayComponent, RouterModule, MinutePipe, CityNamePipe],
  templateUrl: './timetable-page.component.html',
  styleUrls: ['./timetable-page.component.scss']
})
export class TimetablePageComponent {
  private _route = inject(ActivatedRoute);

  origin$: Observable<string> =
    this._route.paramMap.pipe(
      map(o => {
        const origin = o.get('origin');
        if (origin && isAirport(origin)) {
          return cityName(origin);
        } else {
          return '';
        }
      })
    );

  timetables$: Observable<{ destination: Airport, timetables: TimetableFlight[] }[]> =
    this._route.data.pipe(
      map(t => {
        const data = t['origin'] as { origin: Airport; timetable: TimetableFlight[] };

        // get the unique destinations
        const a = data.timetable.map(t => t.route.destination);
        const unique = [...new Set(a)];

        return unique.map(u => {
          const s = data.timetable.filter(t => t.route.destination === u).sort((a, b) => a.departs >= b.departs ? 1 : -1);
          return { destination: u, timetables: s };
        }).sort((a, b) => cityName(a.destination).localeCompare(cityName(b.destination)));
      })
    );
}
