import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOriginPageComponent } from './choose-origin-page.component';

describe('ChooseOriginPageComponent', () => {
  let component: ChooseOriginPageComponent;
  let fixture: ComponentFixture<ChooseOriginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChooseOriginPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseOriginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
