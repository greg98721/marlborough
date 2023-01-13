import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { delay, Observable, Subject } from 'rxjs';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { LoadingService } from './services/loading.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Marlborough';
  isLoading: Observable<boolean>;

  constructor(private _loadingService: LoadingService) {
    this.isLoading = this._loadingService.isLoading;
  }

  ngOnInit(): void {
    // this.isLoading = this._loadingService.isLoading.pipe(delay(0)); // delay prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
  }
}
