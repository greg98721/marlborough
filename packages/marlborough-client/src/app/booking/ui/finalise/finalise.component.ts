import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { parseISO } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { BookingState, DetailsForOneWayBooking, DetailsForReturnBooking } from 'src/app/booking/feature/make-booking/booking-state';
import { MinutePipe } from 'src/app/shared/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';
import { Flight, FlightBooking, PassengerType, Ticket, TicketType } from '@marlborough/model';
import { notUnknown } from 'src/app/shared/utility/useful-functions';

interface Passenger {
  firstName: string;
  surname: string;
  passengerType: PassengerType;
}

interface BookingForForm {
  outboundTicketType: TicketType;
  inboundTicketType?: TicketType;
  passengers: Passenger[];
}

@Component({
  selector: 'app-finalise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonToggleModule, MinutePipe, CityNamePipe],
  templateUrl: './finalise.component.html',
  styleUrls: ['./finalise.component.scss']
})
export class FinaliseComponent {
  private _fb = inject(FormBuilder);


  vm?: DetailsForOneWayBooking | DetailsForReturnBooking = undefined;
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'one_way_booking') {
      this.vm = state;
    } else if (state.kind === 'return_booking') {
      this.vm = state;
    } else {
      throw Error('Invalid state for FinaliseComponent')
    }
  }

  @Output() BookingDefined = new EventEmitter();
  makeBooking() {
    // this.BookingDefined.emit(this.createBooking(''));
  }

  bookingForm = this._fb.nonNullable.group({
    outboundTicketType: ['unknown', notUnknown()],
    inboundTicketType: ['unknown'],
    passengers: this._fb.nonNullable.array([this._fb.nonNullable.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      passengerType: ['unknown', notUnknown()],
    })]),
  });

  addPassenger() {
    this.bookingForm.controls['passengers'].push(this._fb.nonNullable.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      passengerType: ['unknown'],
    }));
  }

  removePassenger(i: number) {
    this.bookingForm.controls['passengers'].removeAt(i);
  }
/*
  createBooking(username: string): FlightBooking {
    if (this.vm?.kind === 'one_way_booking') {
      return {
        kind: 'oneWay',
        purchaserUsername: username,
        date: this.vm.outboundFlight.date,
        flightNumber: this.vm.outboundTimetableFlight.flightNumber,
        tickets: this._tickets
      };
    } else if (this.vm?.kind === 'return_booking') {
      return {
        kind: 'return',
        purchaserUsername: username,
        outboundDate: this.vm.outboundFlight.date,
        outboundFlightNumber: this.vm.outboundTimetableFlight.flightNumber,
        inboundTickets: this._tickets,
        inboundDate: this.vm.inboundFlight.date,
        inboundFlightNumber: this.vm.inboundTimetableFlight.flightNumber,
        outboundTickets: [],
      };
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }
*/
  createDepartureDate(flight: Flight): Date {
    return parseISO(flight.date);
  }

  get availableSeats(): number[] {
    const maxTicketsPerBooking = 8;
    if (this.vm?.kind === 'one_way_booking') {
      const total = this.vm.outboundFlight.emptyFullPriceSeats + this.vm.outboundFlight.emptyDiscountSeats;
      const min = total >= maxTicketsPerBooking ? maxTicketsPerBooking : total;
      return new Array(min).fill(0).map((_, i) => i + 1);
    } else if (this.vm?.kind === 'return_booking') {
      const outbound = this.vm.outboundFlight.emptyFullPriceSeats + this.vm.outboundFlight.emptyDiscountSeats;
      const inbound = this.vm.inboundFlight.emptyFullPriceSeats + this.vm.inboundFlight.emptyDiscountSeats;
      const maxForBothflights = outbound >= inbound ? inbound : outbound;
      const min = maxForBothflights >= maxTicketsPerBooking ? maxTicketsPerBooking : maxForBothflights;
      return new Array(min).fill(0).map((_, i) => i + 1);
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }
}
