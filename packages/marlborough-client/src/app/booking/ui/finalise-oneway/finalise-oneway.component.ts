import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState, DetailsForOneWayBooking } from '../../feature/make-booking/booking-state';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PassengerType } from '@marlborough/model';

@Component({
  selector: 'app-finalise-oneway',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonToggleModule, MatFormFieldModule],
  templateUrl: './finalise-oneway.component.html',
  styleUrls: ['./finalise-oneway.component.scss']
})
export class FinaliseOnewayComponent {
  private _fb = inject(FormBuilder);

  vm?: DetailsForOneWayBooking= undefined;
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'one_way_booking') {
      this.vm = state;
    } else {
      throw Error('Invalid state for FinaliseOnewayComponent')
    }
  }

  @Output() BookingDefined = new EventEmitter();

  bookingForm = this._fb.nonNullable.group({
    ticketType: ['full'],
    passengers: this._fb.nonNullable.array([this._fb.nonNullable.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      passengerType: ['adult'],
    })]),
  });

  get passengerArray() {
    return this.bookingForm.controls['passengers']; // as FormArray<passenger>;
  }
}
