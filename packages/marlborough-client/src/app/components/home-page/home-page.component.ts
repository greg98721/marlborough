import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timer, map } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private _flightService: FlightService) { }

  ngOnInit(): void {
    // when we start grab the images for the destinations page early to let appear instant
    this._flightService.getOrigins().subscribe(o => {
      const x = o;
    });
  }

  /*
  testLoading() {
    let t1 = timer(4000);
    this._loadingService.setLoadingWhile(t1).subscribe(() => console.info('1 happened'));
    let t2 = timer(3000);
    this._loadingService.setLoadingWhile(t2).subscribe(() => console.info('2 happened'));
    let t3 = timer(1000);
    this._loadingService.setLoadingWhile(t3).subscribe(() => console.info('3 happened'));
    let t4 = timer(5000).pipe(
      map(() => {
        throw new Error('This is a test error');
      })
    );
    this._loadingService.setLoadingWhile(t4).subscribe(() => console.info('4 happened'));
  }
  */
}
