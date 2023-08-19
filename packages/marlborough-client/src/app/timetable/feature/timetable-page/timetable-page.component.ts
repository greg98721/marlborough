import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { addMinutes, format } from 'date-fns/fp';
import { Observable, map } from 'rxjs';
import { Airport, cityName, isAirport, TimetableFlight } from '@marlborough/model';
import { WeekDisplayComponent } from 'src/app/shared/ui/week-display/week-display.component';
import { MinutePipe } from 'src/app/shared/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';

@Component({
  selector: 'app-timetable-page',
  standalone: true,
  imports: [CommonModule, WeekDisplayComponent, RouterModule, MinutePipe, CityNamePipe],
  templateUrl: './timetable-page.component.html',
  styleUrls: ['./timetable-page.component.scss']
})
export class TimetablePageComponent {

  private _route = inject(ActivatedRoute);

  vm$: Observable<{ origin: Airport, timetables: { destination: Airport; destinationTimetables: TimetableFlight[] }[]}> = this._route.data.pipe(map(d => d['pageData']));
}
