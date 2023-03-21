import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { Observable, map } from 'rxjs';
import { eachDayOfInterval, formatISOWithOptions, parseISO, addDays, differenceInCalendarDays, isBefore, isSameDay, isEqual } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Airport, Flight, maximumBookingDay, startOfDayInTimezone, TimetableFlight, timezone, EMPTY_FLIGHT, seatsAvailable, minPrice } from '@marlborough/model';
import { MinutePipe } from '../../../common/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-flights-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MinutePipe, CityNamePipe],
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss']
})
export class FlightsPageComponent {
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  vm$: Observable<{ origin: Airport, destination: Airport, flightData: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selected: number, dayRange: Date[] }> =
    this._route.data.pipe(
      map(t => {
        const allTimetableFlights = t['airport'] as { origin: Airport, flights: { timetableFlight: TimetableFlight; flights: Flight[] }[]; selectedDate: string };
        const originTimeZone = timezone(allTimetableFlights.origin);
        const sel = parseISO(allTimetableFlights.selectedDate);
        const selected = startOfDayInTimezone(originTimeZone, sel);
        const earliest = addDays(1, startOfDayInTimezone(originTimeZone, new Date()));
        const destination = allTimetableFlights.flights[0]?.timetableFlight.route.destination;

        // we ant a five day selection around the selected date taking into account where the selected date is near one end of the possible range
        const gap = differenceInCalendarDays(earliest, selected);
        let dayRange: Date[];
        let selIndex: number;
        if (gap < 3) {
          dayRange = eachDayOfInterval({ start: earliest, end: addDays(4, earliest) })
          selIndex = gap;
        } else if (gap > (maximumBookingDay - 2)) {
          dayRange = eachDayOfInterval({ start: addDays(maximumBookingDay - 4, earliest), end: addDays(maximumBookingDay, earliest) })
          selIndex = gap - maximumBookingDay + 4;
        } else {
          dayRange = eachDayOfInterval({ start: addDays(-2, selected), end: addDays(+2, selected) })
          selIndex = 2;
        }

        if (dayRange.length !== 5) {
          throw new Error(`Did not create valid day range - length = ${dayRange.length}`);
        }

        const withinRange = allTimetableFlights.flights.map(f => {
          const parsed = f.flights.map(p => ({ date: parseISO(p.date), flight: p }));
          const filtered = dayRange.map(d => parsed.find(p => isSameDay(p.date, d))?.flight ?? EMPTY_FLIGHT);
          return { timetableFlight: f.timetableFlight, flights: filtered };
        });
        const filtered = withinRange.filter(f => f.flights.filter(l => l.flightNumber !== '').length > 0);
        const sorted = filtered.sort((a, b) => (a.timetableFlight.departs - b.timetableFlight.departs));
        return { origin: allTimetableFlights.origin, destination: destination, flightData: sorted, selected: selIndex, dayRange: dayRange };
      }));

    dateFormat(d: Date): string {
      return formatISOWithOptions({representation: 'date'}, d);
    }

    _seatsAvailable(flight: Flight): boolean {
      return seatsAvailable(flight);
    }

    _minPrice(flight: Flight): number {
      return minPrice(flight);
    }

    numberOfCheapestSeats(flight: Flight): number {
      return flight.emptyDiscountSeats > 0 ? flight.emptyDiscountSeats : flight.emptyFullPriceSeats;
    }

}
