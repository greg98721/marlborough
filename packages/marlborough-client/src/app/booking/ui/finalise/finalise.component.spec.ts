import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaliseComponent } from './finalise.component';

describe('FinaliseComponent', () => {
  let component: FinaliseComponent;
  let fixture: ComponentFixture<FinaliseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinaliseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinaliseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
