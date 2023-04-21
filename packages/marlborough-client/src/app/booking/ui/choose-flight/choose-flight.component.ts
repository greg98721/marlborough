import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { BookingState, NominalBookingDate } from 'src/app/booking/feature/make-booking/booking-state';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';
import { MinutePipe } from 'src/app/common/pipes/minute.pipe';
import { AirRoute, Flight, TimetableFlight, minPrice, seatsAvailable } from '@marlborough/model';

@Component({
  selector: 'app-choose-flight',
  standalone: true,
  imports: [CommonModule, MatIconModule, CityNamePipe, MinutePipe],
  templateUrl: './choose-flight.component.html',
  styleUrls: ['./choose-flight.component.scss']
})
export class ChooseFlightComponent {
  @Input() set bookingState(state: BookingState) {
    if (state.kind === 'nominal_date') {
      this.vm = {
        route: state.route,
        dayRange: state.dayRange,
        nominalDate: state.nominalDate,
        timetableFlights: state.timetableFlights,
      };
    } else if (state.kind === 'nominal_return_date') {
      this.vm = {
        route: state.returnRoute,
        dayRange: state.dayRange,
        nominalDate: state.nominalReturnDate,
        timetableFlights: state.timetableReturnFlights,
      };
    } else {
      throw Error('Invalid state for ChooseOriginComponent')
    }
  }

  @Output() flightSelected: (flight: Flight) => void = () => {};

  vm?: {
    route: AirRoute,
    dayRange: Date[],
    nominalDate: number,
    timetableFlights: { timetableFlight: TimetableFlight, flights: Flight[] }[]
  } = undefined;

  _seatsAvailable(flight: Flight): boolean {
    return seatsAvailable(flight);
  }

  _minPrice(flight: Flight): number {
    return minPrice(flight);
  }

  numberOfCheapestSeats(flight: Flight): number {
    return flight.emptyDiscountSeats > 0 ? flight.emptyDiscountSeats : flight.emptyFullPriceSeats;
  }
}
