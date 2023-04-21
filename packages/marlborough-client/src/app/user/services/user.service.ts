import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, switchMap, of, tap, catchError } from 'rxjs';
import { User } from '@marlborough/model';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { AppConfigService } from 'src/app/common/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUser?: User;
  private _accessToken?: string;

  private _http = inject(HttpClient);
  private _config = inject(AppConfigService);

  login$() : Observable<User | undefined> {
    const dialog = inject(MatDialog);
    return this._recursivelogin$(dialog);
  }

  get currentUser(): User | undefined {
    return this._currentUser;
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  private _recursivelogin$(dialog: MatDialog, username?: string, message?: string): Observable<User | undefined> {
    const dialogRef = dialog.open(LoginDialogComponent, { data: { username: username, message: message }});
    return dialogRef.afterClosed().pipe(
      map((result: { username: string; password: string } | undefined) => {
        return result
      }),
      switchMap(loginDetails => {
        if (loginDetails) {
          const loginUrl = this._config.apiUrl('auth/login');
          const loginBody = { username: loginDetails.username, password: loginDetails.password };
          return this._http.post(loginUrl, loginBody).pipe(
            tap((response: any) => {
              this._accessToken = response.access_token;
            }),
            switchMap((loginResponse: any) => {
              const userUrl = this._config.apiUrl(`auth/user/${loginDetails.username}`);
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
              return this._recursivelogin$(dialog, loginDetails.username, 'Invalid username or password');
            })
          );
        } else {    // the user cancelled the login dialog
          return of(undefined);
        }
      })
    );
  }
}
