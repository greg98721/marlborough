import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, timer, tap } from 'rxjs';

@Injectable()
export class GlobalHttpErrorHandler implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry({
        count: 3,
        delay: (_, retryCount) => timer(retryCount * 1000), // 1 second delay then 2, then 3
      }),
      tap({
        error: () => console.log('HTTP Error: retried 3 times')
      })
    );
  }
}
