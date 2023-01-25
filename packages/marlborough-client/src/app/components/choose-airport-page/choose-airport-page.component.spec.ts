import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAirportPageComponent } from './choose-airport-page.component';

describe('ChooseAirportPageComponent', () => {
  let component: ChooseAirportPageComponent;
  let fixture: ComponentFixture<ChooseAirportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChooseAirportPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseAirportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
