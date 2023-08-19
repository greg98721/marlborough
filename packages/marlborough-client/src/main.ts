import { APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app/app.component';
import { ROUTES } from './app/shared/routing/app.routes';
import { CustomErrorHandler } from './app/shared/utility/custom-error-handler.service';
import { GlobalHttpErrorHandler } from './app/shared/utility/global-http-error-handler.interceptor';
import { FlightService } from './app/timetable/data-access/flight.service';
import { AppConfigService } from './app/shared/services/app-config.service';
import { AuthInterceptor } from './app/user/utility/auth-Interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';


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
      MatSnackBarModule,
      MatDialogModule,
      ReactiveFormsModule
    ),
    {
      provide: APP_INITIALIZER,
      deps: [
        AppConfigService
      ],
      useFactory: (service: AppConfigService) => () => service.load(),  // we are setting the function here - not running it
      multi: true
    },
    provideRouter(ROUTES, withComponentInputBinding()),
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
