import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingDestination, BookingState } from 'src/app/booking/feature/make-booking/booking-state';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AirRoute } from '@marlborough/model';

@Component({
  selector: 'app-choose-date',
  standalone: true,
  imports: [CommonModule, MatNativeDateModule, MatDatepickerModule, CityNamePipe],
  templateUrl: './choose-date.component.html',
  styleUrls: ['./choose-date.component.scss']
})
export class ChooseDateComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'destination') {
      this.vm = {
        route: state.route,
        earliest: state.earliest,
        latest: state.latest
      };
    } else if (state.kind === 'return_flight_requested') {
      this.vm = {
        route: state.returnRoute,
        earliest: state.earliest,
        latest: state.latest
      };
    } else {
      throw Error('Invalid state for ChooseDateComponent')
    }
  }

  @Output() dateSelected = new EventEmitter<Date>();
  selectDate(date: Date) {
    this.dateSelected.emit(date);
  }

  vm?: {
    route: AirRoute,
    earliest: Date,
    latest: Date
  } = undefined;
}
