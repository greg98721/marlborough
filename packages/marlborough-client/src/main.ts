import { APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/routing/app.routes';
import { CustomErrorHandler } from './app/custom-error-handler.service';
import { GlobalHttpErrorHandler } from './app/global-http-error-handler.interceptor';
import { FlightService } from './app/services/flight.service';
import { AppConfigService } from './app/services/app-config.service';
import { AuthInterceptor } from './app/auth-Interceptor';


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
    {
      provide: APP_INITIALIZER,
      deps: [
        AppConfigService
      ],
      useFactory: (service: AppConfigService) => () => service.load(),  // we are setting the function here - not running it
      multi: true
    },
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
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: FlightService, useClass: FlightService }
  ]
})
  .catch(err => console.error(err));
