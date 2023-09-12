import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState, DetailsForOneWayBooking } from '../../feature/make-booking/booking-state';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PassengerType } from '@marlborough/model';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-finalise-oneway',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule],
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

  addPassenger() {
    this.passengerArray.push(this._fb.nonNullable.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      passengerType: ['adult'],
    }));
  }

  removePassenger(index: number) {
    this.passengerArray.removeAt(index);
  }
}
