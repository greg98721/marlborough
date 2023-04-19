import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStart, BookingState } from '../../model/booking-state';
import { Airport } from '@marlborough/model';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';

@Component({
  selector: 'app-choose-origin',
  standalone: true,
  imports: [CommonModule, CityNamePipe],
  templateUrl: './choose-origin.component.html',
  styleUrls: ['./choose-origin.component.scss']
})
export class ChooseOriginComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'start') {
      this.vm = state;
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }

  @Output() originSelected: (origin: string) => void = () => {};

  vm?: BookingStart = undefined;
}
