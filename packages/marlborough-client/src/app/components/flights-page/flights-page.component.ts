import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FlightBookingSelection } from '@marlborough/model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-flights-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss']
})
export class FlightsPageComponent {
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  vm$: Observable<FlightBookingSelection> =
    this._route.data.pipe(
      map(t => {
        return t['airport'] as FlightBookingSelection;
      }));
}
