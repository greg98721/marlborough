import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Airport } from '@marlborough/model';
import { Observable, map } from 'rxjs';
import { CityNamePipe } from 'src/app/common/pipes/city-name.pipe';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-choose-origin-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CityNamePipe],
  templateUrl: './choose-origin-page.component.html',
  styleUrls: ['./choose-origin-page.component.scss']
})

export class ChooseOriginPageComponent {
  private _bookingService = inject(BookingService);
  private _router = inject(Router);

  vm$: Observable<Airport[]> = this._bookingService.allOrigins$();

  originSelected(origin: Airport) {
    this._bookingService.selectOrigin(origin);
    this._router.navigate(['/choose/destination']);
  }
}
