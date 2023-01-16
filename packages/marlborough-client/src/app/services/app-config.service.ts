import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private _apiUrl: string | undefined = undefined;

  constructor(private _http: HttpClient) { }

  load() {
    this._http.get('assets/appsettings.json')
      .subscribe((settings: any) => {
        this._apiUrl = settings.apiUrl;
      });
  }

  apiUrl(route: string): string {
    if (this._apiUrl) {
      return `${this._apiUrl}${route}`;
    } else {
      throw new Error('Trying to read api url before we have loaded the config');
    }
  }
}
