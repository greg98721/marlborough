import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, map, partition, switchMap } from 'rxjs';
import { formatISOWithOptions } from 'date-fns/fp'; // Note using the functional version of the date-fns library

import {
  BookingState,
  addDate,
  addDestination,
  addOrigin,
  oneWayOnly,
  selectOutboundFlight,
  requestReturnFlight,
  addReturnDate
} from './booking-state';
import { FlightService } from 'src/app/timetable/services/flight.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { AirRoute, Airport, Flight, Ticket, cityName } from '@marlborough/model';

@Component({
  selector: 'app-make-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './make-booking.component.html',
  styleUrls: ['./make-booking.component.scss']
})
export class MakeBookingComponent {
  private _flightService = inject(FlightService);
  private _loadingService = inject(LoadingService);
  private _route = inject(ActivatedRoute);
  private _bookingStateSubject = new BehaviorSubject<BookingState>({ kind: 'undefined' });
  private _bookingStateStack: BookingState[] = [];

  constructor() {
    // we can arrive here with or without an origin - so partition the query params to cope with both
    const [originSelected$, needOrigin$] = partition(this._route.queryParamMap, q => q.has('origin'));
    needOrigin$.pipe(
      switchMap(_ => {
        return this._loadingService.setLoadingWhile$(this._flightService.getOrigins$());
      })
    ).subscribe(origins => {
      this._updateState({ kind: 'start', origins })
    });

    originSelected$.pipe(
      map(q => q.get('origin') as Airport),
      switchMap(origin => {
        return this._loadingService.setLoadingWhile$(this._flightService.getDestinations$(origin).pipe(
          map(destinations => ({ origin, destinations }))
        ));
      })
    ).subscribe(r => {
      this._updateState({ kind: 'origin', origin: r.origin, destinationRoutes: r.destinations });
    });
  }

  bookingState: Observable<BookingState> = this._bookingStateSubject.asObservable();

  selectOrigin(origin: Airport) {
    this._loadingService.setLoadingWhile$(this._flightService.getDestinations$(origin)).subscribe(destinationRoutes => {
      const newState: BookingState = addOrigin(this._currentState, origin, destinationRoutes);
      this._updateState(newState);
    });
  }

  selectDestination(destination: AirRoute) {
    const newState: BookingState = addDestination(this._currentState, destination);
    this._updateState(newState);
  }

  selectOutboundDate(date: Date) {
    const datestring = formatISOWithOptions({ representation: 'date' }, date);
    const state = this._currentState;
    if (state.kind === 'destination') {
      this._loadingService.setLoadingWhile$(this._flightService.getFlights$(state.route.origin, state.route.destination)).subscribe(flights => {
        const newState = addDate(state, datestring, flights);
        this._updateState(newState);
      });
    } else {
      throw new Error(`Cannot set the nominal_date state from ${state.kind}`);
    }
  }

  selectOutboundFlight(flight: Flight) {
    const state = this._currentState;
    if (state.kind === 'nominal_date') {
      const timetableFlight = state.timetableFlights.find(t => t.timetableFlight.flightNumber === flight.flightNumber)?.timetableFlight;
      if (timetableFlight) {
        const newState = selectOutboundFlight(state, timetableFlight, flight);
        this._updateState(newState);
      } else {
        throw new Error(`Cannot find timetable flight for flight ${flight.flightNumber}`);
      }
    } else {
      throw new Error(`Cannot set the outbound_flight state from ${state.kind}`);
    }
  }

  selectOneWay() {
    this._updateState(oneWayOnly(this._currentState));
  }

  selectReturn() {
    const state = this._currentState;
    if (state.kind === 'outbound_flight') {
      const returnRoute = { origin: state.outboundTimetableFlight.route.destination, destination: state.outboundTimetableFlight.route.origin };
      const newState = requestReturnFlight(state, returnRoute);
      this._updateState(newState);
    } else {
      throw new Error(`Cannot set the return_flight_requested state from ${state.kind}`);
    }
  }

  selectInboundDate(date: Date) {
    const datestring = formatISOWithOptions({ representation: 'date' }, date);
    const state = this._currentState;
    if (state.kind === 'return_flight_requested') {
      this._loadingService.setLoadingWhile$(this._flightService.getFlights$(state.returnRoute.origin, state.returnRoute.destination)).subscribe(flights => {
        const newState = addReturnDate(state, datestring, flights);
        this._updateState(newState);
      });
    } else {
      throw new Error(`Cannot set the nominal return date state from ${state.kind}`);
    }
  }

  selectInboundFlight(returnFlight: Flight) {
    const state = this._currentState;
    if (state.kind === 'nominal_return_date') {
      const returnTimetableFlight = state.timetableReturnFlights.find(t => t.timetableFlight.flightNumber === returnFlight.flightNumber)?.timetableFlight;
      if (returnTimetableFlight) {
        const newState = selectOutboundFlight(state, returnTimetableFlight, returnFlight);
        this._updateState(newState);
      } else {
        throw new Error(`Cannot find timetable flight for flight ${returnFlight.flightNumber}`);
      }
    } else {
      throw new Error(`Cannot set the inbound_flight state from ${state.kind}`);
    }
  }

  selectTickets(tickets: Ticket[]) {
    // CreateBooking(state: BookingState, tickets: Ticket[])
  }

  private _updateState(state: BookingState) {
    this._bookingStateStack.push(state);
    this._bookingStateSubject.next(state);
  }

  private get _currentState(): BookingState {
    return this._bookingStateStack[this._bookingStateStack.length - 1];
  }

  private _goBack() {
    if (this._bookingStateStack.length > 0) {
      this._bookingStateStack.pop();
      this._bookingStateSubject.next(this._bookingStateStack[this._bookingStateStack.length - 1]);
    }
  }
}
