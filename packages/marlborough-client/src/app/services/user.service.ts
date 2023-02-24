import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@marlborough/model';
import { map, Observable, switchMap, of, tap } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _isLoggedIn = false;
  private _currentUser?: User;
  private _accessToken?: string;

  /** The login dialog is run in the appcomponent to be "global" but called from within this service hence the function */
  private _openLoginDialog$: (username?: string, message?: string) => Observable<{ username?: string; password?: string }> =
    () => { throw new Error('No login dialog set') };

  constructor(private _http: HttpClient, private _config: AppConfigService) { }

  set OpenLoginDialog$(value: (username?: string, message?: string) => Observable<{ username: string; password: string }>) {
    this._openLoginDialog$ = value;
  }

  get currentUser(): User | undefined {
    return this._currentUser;
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  needToLogin$(): Observable<boolean> {
    return this._openLoginDialog$().pipe(
      switchMap(login => {
        if (login.username && login.password) {
          return this.login$(login.username, login.password);
        } else {
          return of(undefined);
        }
      }),
      map(user => {
        this._isLoggedIn = user !== undefined;
        this._currentUser = user;
        return this._isLoggedIn;
      })
    );
  }

  login$(username: string, password: string): Observable<User> {
    const loginUrl = this._config.apiUrl('auth/login');
    const loginBody = { username: username, password: password };
    return this._http.post(loginUrl, loginBody).pipe(
      tap((response: any) => {
        this._accessToken = response.access_token;
      }),
      switchMap((loginResponse: any) => {
        const userUrl = this._config.apiUrl(`auth/user/${username}`);
        return this._http.get(userUrl).pipe(
          map((userResponse: any) => {
            const user: User = {
              username: userResponse.username,
              fullname: userResponse.fullname,
            };
            return user;
          })
        );
      })
      // we have proper http error handling higher up the stack - for here we can ignore it
    )
  }
}
