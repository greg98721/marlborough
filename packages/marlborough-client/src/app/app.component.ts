import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { LoadingService } from './services/loading.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Marlborough';
  isLoading: Observable<boolean>;

  constructor(private _loadingService: LoadingService) {
    this.isLoading = this._loadingService.isLoading;
  }
}
