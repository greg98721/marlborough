import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable, map, share, tap, BehaviorSubject, combineLatest } from 'rxjs';
import {
  addMinutes,
  parseISO,
} from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { Flight, FlightBooking, Purchase, TimetableFlight } from '@marlborough/model';
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
  _bookingSelector$ = new BehaviorSubject<number | undefined>(undefined);
  _form = this._fb.array([]);
  constructor(private _route: ActivatedRoute, private _fb:FormBuilder) {}

  get form() { return this._form as FormArray; }

  vm$: Observable<{ purchase: Purchase, flightBooking: FlightBooking }> =
    combineLatest([this._bookingSelector$, this._route.data]).pipe(
      map(t => {
        const purchase = t[1]['flight'] as Purchase;
        const bookingIndex = t[0] ?? purchase.bookings.length - 1;
        const flightBooking = purchase.bookings[bookingIndex];
        return { purchase, flightBooking: flightBooking };
      }),
      tap(r => {
        // set up the ticket form array
        if (r.flightBooking.tickets.length === 0) { // always have at least one ticket
          r.flightBooking.tickets.push({ customerName: '', ticketType: 'unknown', passengerType: 'unknown', price: r.flightBooking.flight?.fullPrice ?? 0 });
        }
      })
    );

  selectBooking(index: number) {
    this._bookingSelector$.next(index);
  }

  addTicket() {
  }

  deleteTicket(index: number) {
  }

  createDepartureDate(flight: Flight): Date {
    return parseISO(flight.date);
  }
}
