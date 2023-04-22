import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, timer, tap, partition, merge } from 'rxjs';

@Injectable()
export class GlobalHttpErrorHandler implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // we don't want to retry 401s so partition them out first and merge them back in later
    const [unauthorized$, other$] = partition(next.handle(request), resp => resp instanceof HttpResponse && resp.status === 401);
    const retried$ = other$.pipe(
      retry({
        count: 3,
        delay: (_, retryCount) => timer(retryCount * 1000), // 1 second delay then 2, then 3
      }),
      tap({
        error: () => console.log('HTTP Error: retried 3 times')
      })
    );
    return merge(unauthorized$, retried$);
  }
}
