import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { Airport, cityName } from '@marlborough/model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-choose-origin-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-origin-page.component.html',
  styleUrls: ['./choose-origin-page.component.scss']
})

export class ChooseOriginPageComponent {
  constructor(private _flightService: FlightService) { }

  vm$: Observable<{ code: Airport; cityName: string }[]> =
    this._flightService.getOrigins$().pipe(
      // this will have been called before so will be cached
      map(ol => {
        const withNames = ol.map(o => ({ code: o, cityName: cityName(o) }));
        return withNames.sort((a, b) => a.cityName.localeCompare(b.cityName));
      }));
}
