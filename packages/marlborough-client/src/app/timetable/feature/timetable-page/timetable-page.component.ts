import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Airport, TimetableFlight } from '@marlborough/model';
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

  @Input() vm?: {
    origin: Airport,
    timetables: {
      destination: Airport;
      destinationTimetables: TimetableFlight[]
    }[]
  };
}
