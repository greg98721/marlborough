import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlightService } from 'src/app/timetable/services/flight.service';
import { Airport } from '@marlborough/model';
import { Observable, map } from 'rxjs';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-origin-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CityNamePipe],
  templateUrl: './choose-origin-page.component.html',
  styleUrls: ['./choose-origin-page.component.scss']
})

export class ChooseOriginPageComponent {
  constructor(private _flightService: FlightService) { }

  vm$: Observable<Airport[]> = this._flightService.getOrigins$();
}
