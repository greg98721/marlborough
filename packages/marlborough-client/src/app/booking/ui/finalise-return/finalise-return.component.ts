import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState, DetailsForReturnBooking } from '../../feature/make-booking/booking-state';
import { FormBuilder, Validators } from '@angular/forms';
import { notUnknown } from 'src/app/shared/utility/useful-functions';

@Component({
  selector: 'app-finalise-return',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalise-return.component.html',
  styleUrls: ['./finalise-return.component.scss']
})
export class FinaliseReturnComponent {
  private _fb = inject(FormBuilder);

  vm?: DetailsForReturnBooking = undefined;
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'return_booking') {
      this.vm = state;
    } else {
      throw Error('Invalid state for FinaliseComponent')
    }
  }

  @Output() BookingDefined = new EventEmitter();

  bookingForm = this._fb.nonNullable.group({
    outboundTicketType: ['unknown', notUnknown()],
    inboundTicketType: ['unknown', notUnknown()],
    passengers: this._fb.nonNullable.array([this._fb.nonNullable.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      passengerType: ['unknown', notUnknown()],
    })]),
  });
}
