import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable, map, share } from 'rxjs';
import {
  addMinutes,
  parseISO,
} from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Flight, TimetableFlight } from '@marlborough/model';
import { MinutePipe } from '../../pipes/minute.pipe';
import { CityNamePipe } from 'src/app/pipes/city-name.pipe';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, CityNamePipe, MinutePipe, MatButtonToggleModule],
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent {
  constructor(private _route: ActivatedRoute) {}

  vm$: Observable<{ timetableFlight: TimetableFlight, flight: Flight }> =
    this._route.data.pipe(
      map(t => t['flight'] as { timetableFlight: TimetableFlight, flight: Flight }),
      share()
    );

  ticketNumberChoice$: Observable<number[]> = this._route.data.pipe(
    map(t0 => {
      const t = t0['flight'] as { timetableFlight: TimetableFlight, flight: Flight }
      const maxSeats = t.flight.emptySeats > 10 ? 10 : t.flight.emptySeats;
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, maxSeats);
    }));

  createDepartureDate(flight: Flight): Date {
    return parseISO(flight.date);
  }
}
