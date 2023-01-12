import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/app.routes';
import { CustomErrorHandler } from './app/custom-error-handler.service';
import { GlobalHttpErrorHandler } from './app/global-http-error-handler.interceptor';
import { FlightService } from './app/services/flight.service';
import { HttpRequestInterceptor } from './app/http-loading-interceptor';


/*
if (environment.production) {
  enableProdMode();
}
*/

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      HttpClientModule,
      MatSnackBarModule
    ),
    provideRouter(ROUTES),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorHandler,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    { provide: FlightService, useClass: FlightService }
  ]
})
  .catch(err => console.error(err));
