import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  private _snackbar = inject(MatSnackBar);
  // Note - because this runs outside of the normal Angular zone - have to provide our own to enable timeouts and button handling
  private _zone = inject(NgZone);

  // Also in the dark them there is poor contrast on the close button - seems to be an open issue
  handleError(error: unknown) {
    this._zone.run(() => {
      this._snackbar.open(
        'Error was detected! Details in the console',
        'Close',
        {
          duration: 8000
        }
      );
    })
    console.warn(`Caught by Custom Error Handler: `, error);
  }
}
