import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.routes';
import { FlightService } from './app/services/flight.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROUTES),
    { provide: FlightService, useClass: FlightService}
  ]
})
  .catch(err => console.error(err));
