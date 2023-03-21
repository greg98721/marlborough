import { Injectable } from '@angular/core';
import { Flight, Ticket, TimetableFlight } from '@marlborough/model';
import { addReturnFlight, ClientFlightBooking, ClientOneWayBooking, createOneWayFlight } from '../model/clientBooking';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _currentBooking?: ClientFlightBooking;

  constructor(private _userService: UserService) {}

  addBooking(timetableFlight: TimetableFlight, flight: Flight): ClientFlightBooking {
    if (this._userService.currentUser !== undefined) {
      if (this._currentBooking === undefined) { // if there is not an existing booking
        this._currentBooking = createOneWayFlight(flight, timetableFlight, this._userService.currentUser.fullname);
        return this._currentBooking;
      } else if (this._currentBooking.kind === 'oneWay') { // if there is an existing booking and it is a one-way booking
        const returnBooking = addReturnFlight(this._currentBooking, flight, timetableFlight);
        this._currentBooking = returnBooking;
        return returnBooking;
      } else { // this._currentBooking.kind === 'return'
        throw new Error('Cannot add a booking to a return booking');
      }
    } else {
      throw new Error('You must be logged in to start a purchase');
    }
  }

  completePurchase() {
    if (this._currentBooking !== undefined) {
      // TODO call API to save purchase
      this._currentBooking = undefined;
    } else {
      throw new Error('There is no purchase in progress');
    }
  }

}
