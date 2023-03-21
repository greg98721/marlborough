import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDestinationPageComponent } from './choose-destination-page.component';

describe('ChooseDestinationPageComponent', () => {
  let component: ChooseDestinationPageComponent;
  let fixture: ComponentFixture<ChooseDestinationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChooseDestinationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDestinationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
