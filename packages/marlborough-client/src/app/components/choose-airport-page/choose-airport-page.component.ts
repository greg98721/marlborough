import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, partition, switchMap, merge } from 'rxjs';
import { RouterModule } from '@angular/router';

import { FlightService } from 'src/app/services/flight.service';
import { Airport, cityName } from '@marlborough/model';

@Component({
  selector: 'app-choose-airport-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-airport-page.component.html',
  styleUrls: ['./choose-airport-page.component.scss']
})
export class ChooseAirportPageComponent implements OnInit {
  displayData$?: Observable<{
    originCode: Airport | undefined;
    originName: string | undefined;
    originList: { code: Airport; cityName: string }[];
    destinationList: { code: Airport; cityName: string }[];
  }>;
  constructor(private _flightService: FlightService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    const [hasOrigin, noOrigin] = partition(this._route.queryParamMap, p => p.has('from'));

    const withOriginList$ = noOrigin.pipe(
      switchMap(p => this._flightService.getOrigins()), // this will have been called before so will be cached
      map(ol => {
        const withNames = ol.map(o => ({ code: o, cityName: cityName(o) }));
        const sorted = withNames.sort((a, b) => a.cityName.localeCompare(b.cityName));
        return { originCode: undefined, originName: undefined, originList: sorted, destinationList: [] };
      })
    );

    const withDestinationList$ = hasOrigin.pipe(
      switchMap(p => {
        const origin = p.get('from');
        if (origin) {
          return this._flightService.getTimetable(origin);
        } else {
          throw Error('Should never get here as we have checked we had an origin parameter')
        }
      }), // this will have been called before so will be cached
      map(timetables => {
        if (timetables.length > 0) {
          // get the unique destinations
          const a = timetables.map(t => t.route.destination);
          const unique = [...new Set(a)];
          const withNames = unique.map(o => ({ code: o, cityName: cityName(o) }));
          const sorted = withNames.sort((a, b) => a.cityName.localeCompare(b.cityName));
          const originCode = timetables[0].route.origin;
          const origin = cityName(originCode);
          return { originCode: originCode, originName: origin, originList: [], destinationList: sorted };
        } else {
          return { originCode: undefined, originName: undefined, originList: [], destinationList: [] };
        }
      })
    );

    this.displayData$ = merge(withOriginList$, withDestinationList$);
  }

  selectOrigin(origin: Airport) {

  }

  selectDestination(origin: Airport, destination: Airport) {

  }

}
