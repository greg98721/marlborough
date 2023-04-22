import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState, OutboundFlight } from 'src/app/booking/feature/make-booking/booking-state';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-return',
  standalone: true,
  imports: [CommonModule, CityNamePipe],
  templateUrl: './choose-return.component.html',
  styleUrls: ['./choose-return.component.scss']
})
export class ChooseReturnComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'outbound_flight') {
      this.vm = state;
    } else {
      throw Error('Invalid state for ChooseReturnComponent')
    }
  }

  @Output() oneWaySelected: () => void = () => {};
  @Output() returnSelected: () => void = () => {};

  vm?: OutboundFlight = undefined;

}
