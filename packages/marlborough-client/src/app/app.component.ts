import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingOverlayComponent } from './common/components/loading-overlay/loading-overlay.component';
import { LoadingService } from './common/services/loading.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _loadingService = inject(LoadingService)
  title = 'Marlborough';
  isLoading$ = this._loadingService.isLoading$;
}
