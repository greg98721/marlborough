import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { parseISO } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import { BookingState, DetailsForOneWayBooking, DetailsForReturnBooking } from 'src/app/booking/feature/make-booking/booking-state';
import { MinutePipe } from 'src/app/common/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';
import { Flight, FlightBooking, Ticket } from '@marlborough/model';

@Component({
  selector: 'app-finalise',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MinutePipe, CityNamePipe],
  templateUrl: './finalise.component.html',
  styleUrls: ['./finalise.component.scss']
})

export class FinaliseComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'one_way_booking') {
      this.vm = state;
    } else if (state.kind === 'return_booking') {
      this.vm = state;
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }

  @Output() makeBooking: () => void = () => {};

  private _tickets: Ticket[] = [];

  vm?: DetailsForOneWayBooking | DetailsForReturnBooking = undefined;

  createBooking(): FlightBooking {
    if (this.vm?.kind === 'one_way_booking') {
      return {
        kind: 'oneWay',
        date: this.vm.outboundFlight.date,
        flightNumber: this.vm.outboundTimetableFlight.flightNumber,
        tickets: this._tickets
      };
    } else if (this.vm?.kind === 'return_booking') {
      return {
        kind: 'return',
        outboundDate: this.vm.outboundFlight.date,
        outboundFlightNumber: this.vm.outboundTimetableFlight.flightNumber,
        inboundDate: this.vm.inboundFlight.date,
        inboundFlightNumber: this.vm.inboundTimetableFlight.flightNumber,
        tickets: this._tickets
      };
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }

  createDepartureDate(flight: Flight): Date {
    return parseISO(flight.date);
  }

  get availableSeats(): number[] {
    if (this.vm?.kind === 'one_way_booking') {
      const n = this.vm.outboundFlight.emptyFullPriceSeats + this.vm.outboundFlight.emptyDiscountSeats;
      return new Array(n).fill(0).map((_, i) => i + 1);
    } else if (this.vm?.kind === 'return_booking') {
      const outbound = this.vm.outboundFlight.emptyFullPriceSeats + this.vm.outboundFlight.emptyDiscountSeats;
      const inbound = this.vm.inboundFlight.emptyFullPriceSeats + this.vm.inboundFlight.emptyDiscountSeats;
      const min = outbound >= inbound ? inbound : outbound;
      return new Array(min).fill(0).map((_, i) => i + 1);
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }
}
