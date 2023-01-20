import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { addMinutes, format } from 'date-fns/fp';
import { Airport, cityName, isAirport, TimetableFlight } from '@marlborough/model';
import { WeekDisplayComponent } from '../week-display/week-display.component';

@Component({
  selector: 'app-timetable-page',
  standalone: true,
  imports: [CommonModule, WeekDisplayComponent],
  templateUrl: './timetable-page.component.html',
  styleUrls: ['./timetable-page.component.scss']
})
export class TimetablePageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  origin = '';
  timetables: { destination: string; destCode: string; timetables: TimetableFlight[] }[] = [];

  ngOnInit(): void {
    const airport = this.route.snapshot.paramMap.get('airport');
    if (airport && isAirport(airport)) {
      this.origin = cityName(airport);
    }
    const timetables = this.route.snapshot.data['airport'] as TimetableFlight[];

    // get the unique destinations
    const a = timetables.map(t => t.route.destination);
    const unique =[...new Set(a)];

    this.timetables = unique.map(u => {
      const name = cityName(u);
      const s = timetables.filter(t => t.route.destination === u).sort((a, b) => a.departs >= b.departs ? 1 : -1 );
      return { destination: name, destCode: u, timetables: s };
    }).sort((a, b) => a.destination.localeCompare(b.destination));
  }

  formatTime(minutes: number): string {
    // we need a date, event though it will disappear when we format it again
    return format('p', addMinutes(minutes, new Date(2023, 1, 1, 0, 0, 0)));
  }

  gotoDestinationTimetable(dest: string) {
    this.router.navigate([`/timetable/${dest}`]);
  }
}
