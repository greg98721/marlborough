import { Routes } from '@angular/router';
import { DestinationsPageComponent } from '../feature/destinations-page/destinations-page.component';
import { FlightsPageComponent } from '../feature/flights-page/flights-page.component';
import { TimetablePageComponent } from '../feature/timetable-page/timetable-page.component';
import { FlightsResolver } from './flights.resolver';
import { TimetableResolver } from './timetable.resolver';

export const TIMETABLE_ROUTES: Routes = [
  { path: 'destinations', component: DestinationsPageComponent },
  { path: 'timetable/:origin', component: TimetablePageComponent, resolve: { origin: TimetableResolver } },
  { path: 'flights', component: FlightsPageComponent, resolve: { airport: FlightsResolver } },
];
