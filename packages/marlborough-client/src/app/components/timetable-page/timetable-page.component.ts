import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { addMinutes, format } from 'date-fns/fp';
import { Observable, map } from 'rxjs';
import { Airport, cityName, isAirport, TimetableFlight } from '@marlborough/model';
import { WeekDisplayComponent } from '../week-display/week-display.component';

@Component({
  selector: 'app-timetable-page',
  standalone: true,
  imports: [CommonModule, WeekDisplayComponent, RouterModule],
  templateUrl: './timetable-page.component.html',
  styleUrls: ['./timetable-page.component.scss']
})
export class TimetablePageComponent {
  constructor(private _route: ActivatedRoute) { }

  origin$ = this._route.paramMap.pipe(
    map(o => {
      const origin = o.get('origin');
      if (origin && isAirport(origin)) {
        return cityName(origin);
      } else {
        return '';
      }
    })
  );

  timetables$ = this._route.data.pipe(
    map(t => {
      const data = t['airport'] as { origin: Airport; timetable: TimetableFlight[]};

      // get the unique destinations
      const a = data.timetable.map(t => t.route.destination);
      const unique = [...new Set(a)];

      return unique.map(u => {
        const name = cityName(u);
        const s = data.timetable.filter(t => t.route.destination === u).sort((a, b) => a.departs >= b.departs ? 1 : -1);
        return { destination: name, destCode: u, timetables: s };
      }).sort((a, b) => a.destination.localeCompare(b.destination));
    })
  );

  formatTime(minutes: number): string {
    // we need a date, even though it will disappear when we format it again
    return format('p', addMinutes(minutes, new Date(2023, 1, 1, 0, 0, 0)));
  }
}
