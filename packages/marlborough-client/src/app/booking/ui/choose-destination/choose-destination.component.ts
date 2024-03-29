import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingOrigin, BookingState } from 'src/app/booking/feature/make-booking/booking-state';
import { AirRoute } from '@marlborough/model';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';

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

  @Output() destinationSelected = new EventEmitter<AirRoute>();
  chooseDestination(route: AirRoute) {
    this.destinationSelected.emit(route);
  }

  vm?: BookingOrigin = undefined;
}
