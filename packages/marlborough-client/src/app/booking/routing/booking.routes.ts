import { Routes } from '@angular/router';
import { isAuthenticated$ } from 'src/app/user/routing/authentication.guard';
import { BookingPageComponent } from '../components/booking-page/booking-page.component';
import { ChooseDepartureDatePageComponent } from '../components/choose-departure-date-page/choose-departure-date-page.component';
import { ChooseDestinationPageComponent } from '../components/choose-destination-page/choose-destination-page.component';
import { ChooseOriginPageComponent } from '../components/choose-origin-page/choose-origin-page.component';
import { BookingResolver } from './booking.resolver';


export const BOOKING_ROUTES: Routes = [
  { path: 'booking/:flight/:date', component: BookingPageComponent, resolve: { flight: BookingResolver }, canActivate: [isAuthenticated$]},
  { path: 'choose/:origin/:destination', component: ChooseDepartureDatePageComponent },
  { path: 'choose/:origin', component: ChooseDestinationPageComponent },
  { path: 'choose', component: ChooseOriginPageComponent },
];
