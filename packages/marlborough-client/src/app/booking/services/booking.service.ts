import { Injectable, inject } from '@angular/core';
import { Airport, Flight, Ticket, TimetableFlight, cityName } from '@marlborough/model';
import { addReturnFlight, ClientFlightBooking, ClientOneWayBooking, createOneWayFlight } from '../model/client-booking';
import { UserService } from '../../user/services/user.service';
import { BookingState, startBooking, backToBookingStart, addOrigin } from '../model/booking-state';
import { FlightService } from 'src/app/timetable/services/flight.service';
import { Observable, map } from 'rxjs';
import { LoadingService } from 'src/app/common/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _flightService = inject(FlightService);
  private _loadingService = inject(LoadingService);
  private _currentState = startBooking();

  private _userService = inject(UserService);
  private _currentBooking?: ClientFlightBooking;

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

  startWithOriginSelection(): Observable<Airport[]> {
    this._currentState = startBooking();
    return this._flightService.getOrigins$();
  }

  selectOrigin(origin: Airport) {
    this._currentState = addOrigin(this._currentState, origin);
  }

  startWithDestinationSelection(origin: Airport): Observable<{ origin: Airport; destinationList: Airport[] }> {
    // could have jumped straight to this page from timetable pages
    const initial = startBooking();
    this._currentState = addOrigin(initial, origin);
  }

  getDestinations$(): Observable<{ origin: Airport; destinationList: Airport[] }> {
    return this._loadingService.setLoadingWhile$(this._flightService.getTimetable$(origin as Airport)).pipe(
      map(data => {
        if (data.timetable.length > 0) {
          // get the unique destinations
          const a = data.timetable.map(t => t.route.destination);
          const unique = [...new Set(a)];
          const sorted = unique.sort((a, b) => cityName(a).localeCompare(cityName(b)));
          return {
            origin: data.origin,
            destinationList: sorted
          };
        } else {
          throw Error('Should never get here as we have checked we had an origin parameter')
        }
      })
    );
  }


  allOrigins$(): Observable<Airport[]> {
    return this._flightService.getOrigins$();
  }

  validDestinations$(): Observable<Airport[]> {
    if (this._currentState.kind === 'selectingOrigin') {
      return this._flightService.getDestinations$(this._currentState.origin);
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

  startBooking() {
    this._currentState = backToBookingStart(this._currentState);
  }

  _selectOrigin(origin: Airport) {
    this._currentState = addOrigin(this._currentState, origin);
  }

  selectDestination(destination: Airport) {
  }
}
