import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Flight, TimetableFlight } from '@marlborough/model';
import { CityNamePipe } from 'src/app/pipes/city-name.pipe';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, CityNamePipe],
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent {
  constructor(private _route: ActivatedRoute) { }
  vm$: Observable<{ timetableFlight: TimetableFlight, flight: Flight }> =
    this._route.data.pipe(
      map(t => t['flight'] as { timetableFlight: TimetableFlight, flight: Flight }
      ));
}
