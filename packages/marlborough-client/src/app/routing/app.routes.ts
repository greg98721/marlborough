import { Routes } from '@angular/router';
import { DestinationsPageComponent } from '../components/destinations-page/destinations-page.component';
import { FlightsPageComponent } from '../components/flights-page/flights-page.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { TimetablePageComponent } from '../components/timetable-page/timetable-page.component';
import { TimetableResolver } from './timetable.resolver';
import { FlightsResolver } from './flights.resolver';
import { ChooseOriginPageComponent } from '../components/choose-origin-page/choose-origin-page.component';
import { ChooseDepartureDatePageComponent } from '../components/choose-departure-date-page/choose-departure-date-page.component';
import { ChooseDestinationPageComponent } from '../components/choose-destination-page/choose-destination-page.component';
import { BookingPageComponent } from '../components/booking-page/booking-page.component';
import { BookingResolver } from './booking.resolver';

export const ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'destinations', component: DestinationsPageComponent },
  { path: 'timetable/:origin', component: TimetablePageComponent, resolve: { origin: TimetableResolver } },
  { path: 'flights', component: FlightsPageComponent, resolve: { airport: FlightsResolver } },
  { path: 'booking/:flight/:date', component: BookingPageComponent, resolve: { flight: BookingResolver } },
  { path: 'choose/:origin/:destination', component: ChooseDepartureDatePageComponent },
  { path: 'choose/:origin', component: ChooseDestinationPageComponent },
  { path: 'choose', component: ChooseOriginPageComponent },
];
