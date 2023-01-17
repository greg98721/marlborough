import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timer, map, Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { FlightService } from 'src/app/services/flight.service';
import { Airport } from '@marlborough/model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  origins?: Observable<Airport[]>;

  constructor(private _flightService: FlightService) { }

  ngOnInit(): void {
    // when we start grab the images for the destinations page early to let appear instant
    // no need for the loading service as this is intended to be in the background
    this.origins = this._flightService.getOrigins();
  }
}
