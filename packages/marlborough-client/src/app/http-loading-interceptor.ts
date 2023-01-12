
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { LoadingService } from './services/loading.service';


/**
 * This class is for intercepting http requests. When a request starts, we set the loadingSub property
 * in the LoadingService to true. Once the request completes and we have a response, set the loading
 * property to false. If an error occurs while servicing the request, set the loadingSub property to false.
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private _loading: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loading.setLoading(true, request.url);
    return next.handle(request)
      .pipe(
        tap({
          next: (evt: HttpEvent<any>) => {
            if (evt instanceof HttpResponse) {  // only in cases where we get a response back
              this._loading.setLoading(false, request.url);
            }
          },
          error: () => this._loading.setLoading(false, request.url)   // in every case stop the loading indicator
        })
      );
  }
}
