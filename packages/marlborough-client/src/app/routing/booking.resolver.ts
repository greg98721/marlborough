import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Flight, Purchase, TimetableFlight } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { BookingService } from "../services/booking.service";
import { FlightService } from "../services/flight.service";
import { LoadingService } from "../services/loading.service";


@Injectable({ providedIn: 'root' })
export class BookingResolver implements Resolve<Purchase> {
  constructor(private _flightService: FlightService, private _bookingService: BookingService, private _loadingService: LoadingService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Purchase> {
    const flightNumber = route.paramMap.get('flight');
    const dateOfFlight = route.paramMap.get('date');
    if (flightNumber && dateOfFlight) {
      return this._loadingService.setLoadingWhile$(
        this._flightService.getTimetableFlight$(flightNumber, dateOfFlight).pipe(
          map(f => {
            const purchase = this._bookingService.startPurchase();
            const newBooking = { date: f.flight.date, flightNumber: f.flight.flightNumber, tickets: [], flight: f.flight, timetableFlight: f.timetableFlight };
            purchase.bookings.push(newBooking);
            return purchase;
          })
        ));
    } else {
      throw new Error('No flight number or date when navigating to booking');
    }
  }
}
