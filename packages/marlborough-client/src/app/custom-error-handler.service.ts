import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private snackbar: MatSnackBar, private zone: NgZone) { }
  // Note the NgZone - because this runs outside of the normal Angular zone - have to provide our own to enable timeouts and button handling

  handleError(error: unknown) {
    this.zone.run(() => {
      this.snackbar.open(
        'Error was detected! We are already working on it!',
        'Close',
        {
          duration: 2000
        }
      );
    })
    console.warn(`Caught by Custom Error Handler: `, error);
  }
}
