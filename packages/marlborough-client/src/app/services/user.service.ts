import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@marlborough/model';
import { map, Observable, switchMap, of, tap, catchError } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUser?: User;
  private _accessToken?: string;

  /** The login dialog is run in the appcomponent to be "global" but called from within this service hence the function */
  private _openLoginDialog$: (username?: string, message?: string) => Observable<{ username: string; password: string } | undefined> =
    () => { throw new Error('No login dialog set') };

  constructor(private _http: HttpClient, private _config: AppConfigService) {}

  set OpenLoginDialog$(value: (username?: string, message?: string) => Observable<{ username: string; password: string } | undefined>) {
    this._openLoginDialog$ = value;
  }

  get currentUser(): User | undefined {
    return this._currentUser;
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  login$(username?: string, message?: string): Observable<User | undefined> {
    return this._openLoginDialog$(username, message).pipe(
      switchMap(loginDetails => {
        if (loginDetails) {
          const loginUrl = this._config.apiUrl('auth/login');
          const loginBody = { username: loginDetails.username, password: loginDetails.password };
          return this._http.post(loginUrl, loginBody).pipe(
            tap((response: any) => {
              this._accessToken = response.access_token;
            }),
            switchMap((loginResponse: any) => {
              const userUrl = this._config.apiUrl(`auth/user/${username}`);
              return this._http.get(userUrl).pipe(
                map((userResponse: any) => {
                  return {
                    username: userResponse.username,
                    fullname: userResponse.fullname,
                  };
                }),
                tap((user: User) => {
                  this._currentUser = user;
                })
              );
            }),
            catchError((error: any) => {
              // we could not authenticate this user - put up the login dialog again with the error message
              return this.login$(loginDetails.username, 'Invalid username or password');
            })
          );
        } else {    // the user cancelled the login dialog
          return of(undefined);
        }
      })
    );
  }
}
