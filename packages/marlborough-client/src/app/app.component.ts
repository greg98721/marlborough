import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { delay } from 'rxjs';
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
  loading: boolean = false;

  constructor(private _loading: LoadingService) { }

  ngOnInit(): void {
    this._loading.loadingSub.pipe(
      delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
