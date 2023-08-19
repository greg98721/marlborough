import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'

import { Airport, Flight, TimetableFlight, seatsAvailable, minPrice } from '@marlborough/model';
import { MinutePipe } from 'src/app/shared/pipes/minute.pipe';
import { CityNamePipe } from 'src/app/shared/pipes/city-name.pipe';

@Component({
  selector: 'app-flights-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MinutePipe, CityNamePipe],
  templateUrl: './flights-page.component.html',
  styleUrls: ['./flights-page.component.scss']
})
export class FlightsPageComponent {
  @Input() vm?: {
    origin: Airport,
    destination: Airport,
    flightData: {
      timetableFlight: TimetableFlight;
      flights: Flight[]
    }[];
    selected: number,
    dayRange: Date[]
  };

  _seatsAvailable = seatsAvailable;

  _minPrice = minPrice;

  numberOfCheapestSeats(flight: Flight): number {
    return flight.emptyDiscountSeats > 0 ? flight.emptyDiscountSeats : flight.emptyFullPriceSeats;
  }

}
