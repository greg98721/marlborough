import { Routes } from '@angular/router';
import { DestinationsPageComponent } from '../feature/destinations-page/destinations-page.component';
import { FlightsPageComponent } from '../feature/flights-page/flights-page.component';
import { TimetablePageComponent } from '../feature/timetable-page/timetable-page.component';
import { resolveFlights } from './flights.resolver';
import { resolveTimetables } from './timetable.resolver';

export const TIMETABLE_ROUTES: Routes = [
  { path: 'destinations', component: DestinationsPageComponent },
  { path: 'timetable/:origin', component: TimetablePageComponent, resolve: { pageData: resolveTimetables } },
  { path: 'flights', component: FlightsPageComponent, resolve: { pageData: resolveFlights } },
];
