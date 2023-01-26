import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, partition, switchMap, merge } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { addDays } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { FlightService } from 'src/app/services/flight.service';
import { Airport, cityName, isAirport } from '@marlborough/model';
import { LoadingService } from 'src/app/services/loading.service';

type DisplayData = {
  origin: { code: Airport; cityName: string } | undefined;
  originList: { code: Airport; cityName: string }[];
  destination: { code: Airport; cityName: string } | undefined;
  destinationList: { code: Airport; cityName: string }[];
}

@Component({
  selector: 'app-choose-airport-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatNativeDateModule, MatDatepickerModule, MatCardModule],
  templateUrl: './choose-airport-page.component.html',
  styleUrls: ['./choose-airport-page.component.scss']
})
export class ChooseAirportPageComponent implements OnInit {
  displayData$?: Observable<DisplayData>;
  earliestDate: Date;
  latestDate: Date;

  constructor(private _flightService: FlightService, private _route: ActivatedRoute, private _loadingService: LoadingService) {
    this.earliestDate = addDays(1, new Date());
    this.latestDate = addDays(42, this.earliestDate);
  }

  ngOnInit(): void {
    const [hasOrigin$, noOrigin$] = partition(this._route.queryParamMap, p => p.has('origin'));
    const [hasDestination$, noDestination$] = partition(hasOrigin$, p => p.has('destination'));

    const withOriginList$: Observable<DisplayData> = noOrigin$.pipe(
      switchMap(p => this._flightService.getOrigins$()), // this will have been called before so will be cached
      map(ol => {
        const withNames = ol.map(o => ({ code: o, cityName: cityName(o) }));
        const sorted = withNames.sort((a, b) => a.cityName.localeCompare(b.cityName));
        return { origin: undefined, originList: sorted, destination: undefined, destinationList: [] };
      })
    );

    const withDestinationList$: Observable<DisplayData> = noDestination$.pipe(
      switchMap(p => {
        const origin = p.get('origin');
        if (origin) {
          // This could be a new call to the API server so put up the twirly whirly in case it takes some time
          return this._loadingService.setLoadingWhile$(this._flightService.getTimetable$(origin));
        } else {
          throw Error('Should never get here as we have checked we had an origin parameter')
        }
      }),
      map(timetables => {
        if (timetables.length > 0) {
          // get the unique destinations
          const a = timetables.map(t => t.route.destination);
          const unique = [...new Set(a)];
          const withNames = unique.map(o => ({ code: o, cityName: cityName(o) }));
          const sorted = withNames.sort((a, b) => a.cityName.localeCompare(b.cityName));
          const originCode = timetables[0].route.origin;
          const originName = cityName(originCode);
          return { origin: { code: originCode, cityName: originName }, originList: [], destination: undefined, destinationList: sorted };
        } else {
          return { origin: undefined, originList: [], destination: undefined, destinationList: [] };
        }
      })
    );

    const forDateSelection$: Observable<DisplayData> = hasDestination$.pipe(
      map(p => {
        const origin = p.get('origin');
        const destination = p.get('destination');
        if (origin && destination && isAirport(origin) && isAirport(destination)) {
          const originCode = origin as Airport;
          const originName = cityName(originCode);
          const destinationCode = destination as Airport;
          const destinationName = cityName(destinationCode);
          return { origin: { code: originCode, cityName: originName }, originList: [], destination: { code: destinationCode, cityName: destinationName }, destinationList: [] };
        } else {
          throw new Error(`Invalid parameters in choosing an airport; origin: ${origin}, destination: ${destination}`);
        }
      })
    );

    this.displayData$ = merge(withOriginList$, withDestinationList$, forDateSelection$);
  }

  dateSelected(d: Date) {
    let a = d;
  }
}
