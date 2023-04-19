import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingOrigin, BookingState } from '../../model/booking-state';
import { AirRoute } from '@marlborough/model';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-destination',
  standalone: true,
  imports: [CommonModule, CityNamePipe],
  templateUrl: './choose-destination.component.html',
  styleUrls: ['./choose-destination.component.scss']
})
export class ChooseDestinationComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'origin') {
      this.vm = state;
    } else {
      throw Error('Invalid state for ChooseDestinationComponent')
    }
  }

  @Output() destinationSelected: (destination: AirRoute) => void = () => {};

  vm?: BookingOrigin = undefined;
}
