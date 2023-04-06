import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Flight, Purchase, TimetableFlight } from "@marlborough/model";
import { Observable, map } from "rxjs";
import { BookingService } from "../services/booking.service";
import { FlightService } from "../../timetable/services/flight.service";
import { LoadingService } from "../../common/services/loading.service";


@Injectable({ providedIn: 'root' })
export class BookingResolver implements Resolve<Purchase> {
  private _flightService = inject(FlightService);
  private _bookingService = inject(BookingService);
  private _loadingService = inject(LoadingService);

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
