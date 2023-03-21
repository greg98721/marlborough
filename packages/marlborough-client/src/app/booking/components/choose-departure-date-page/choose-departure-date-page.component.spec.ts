import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDepartureDatePageComponent } from './choose-departure-date-page.component';

describe('ChooseDepartureDatePageComponent', () => {
  let component: ChooseDepartureDatePageComponent;
  let fixture: ComponentFixture<ChooseDepartureDatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChooseDepartureDatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDepartureDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
