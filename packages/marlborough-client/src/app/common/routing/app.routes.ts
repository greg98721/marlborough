import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { BOOKING_ROUTES } from 'src/app/booking/routing/booking.routes';
import { TIMETABLE_ROUTES } from 'src/app/timetable/routing/timetable.routes';

export const ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  ...TIMETABLE_ROUTES,
  ...BOOKING_ROUTES,
];
