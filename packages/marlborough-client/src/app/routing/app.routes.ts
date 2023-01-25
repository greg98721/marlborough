import { Routes } from '@angular/router';
import { DestinationsPageComponent } from '../components/destinations-page/destinations-page.component';
import { FlightsPageComponent } from '../components/flights-page/flights-page.component';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { TimetablePageComponent } from '../components/timetable-page/timetable-page.component';
import { ChooseAirportPageComponent } from '../components/choose-airport-page/choose-airport-page.component';
import { TimetableResolver } from './timetable.resolver';

export const ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'destinations', component: DestinationsPageComponent },
  { path: 'timetable/:airport', component: TimetablePageComponent, resolve: { airport: TimetableResolver } },
  { path: 'flights', component: FlightsPageComponent },
  { path: 'choose', component: ChooseAirportPageComponent },
];
