import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { LoadingService } from './services/loading.service';
import { UserService } from './services/user.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, LoadingOverlayComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Marlborough';
  isLoading$: Observable<boolean>;

  private openLoginDialog$(username?: string, message?: string): Observable<{ username: string; password: string } | undefined> {
    const dialog = inject(MatDialog);
    const dialogRef = dialog.open(LoginDialogComponent, { data: { username: username, message: message }});
    return dialogRef.afterClosed().pipe(
      map((result: { username: string; password: string } | undefined) => {
        return result
      }));
  }

  constructor(private _loadingService: LoadingService, private _userService: UserService) {
    this.isLoading$ = this._loadingService.isLoading$;
    this._userService.openLoginDialog = this.openLoginDialog$;
  }
}
