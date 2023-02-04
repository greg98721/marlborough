import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FlightService } from 'src/app/services/flight.service';
import { Airport, cityName, isAirport } from '@marlborough/model';
import { Observable, map, switchMap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { CityNamePipe } from 'src/app/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-destination-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CityNamePipe],
  templateUrl: './choose-destination-page.component.html',
  styleUrls: ['./choose-destination-page.component.scss']
})
export class ChooseDestinationPageComponent {
  constructor(private _flightService: FlightService, private _route: ActivatedRoute, private _loadingService: LoadingService) { }

  vm$: Observable<{ origin: Airport; destinationList: Airport[] }> =
    this._route.paramMap.pipe(
      switchMap(p => {
        const origin = p.get('origin');
        if (origin && isAirport(origin)) {
          // This could be a new call to the API server so put up the twirly whirly in case it takes some time
          return this._loadingService.setLoadingWhile$(this._flightService.getTimetable$(origin as Airport));
        } else {
          throw Error('Should never get here as we have checked we had an origin parameter')
        }
      }),
      map(data => {
        if (data.timetable.length > 0) {
          // get the unique destinations
          const a = data.timetable.map(t => t.route.destination);
          const unique = [...new Set(a)];
          const sorted = unique.sort((a, b) => cityName(a).localeCompare(cityName(b)));
          return {
            origin: data.origin,
            destinationList: sorted
          };
        } else {
          throw Error('Should never get here as we have checked we had an origin parameter')
        }
      })
    );
}
