import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Airport, Flight, FlightBookingSelection, isAirport, TimetableFlight } from '@marlborough/model';
import { Observable, map, catchError } from 'rxjs';

@Component({
  selector: 'app-flights-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss']
})
export class FlightsPageComponent {

  flights$ = this._route.data.pipe(
    map(t => {
      return t['airport'] as FlightBookingSelection;
    }));

  constructor(private _route: ActivatedRoute, private _router: Router) { }
}
