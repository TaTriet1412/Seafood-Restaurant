import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsShiftsComponent } from './bills-shifts.component';

describe('BillsShiftsComponent', () => {
  let component: BillsShiftsComponent;
  let fixture: ComponentFixture<BillsShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsShiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
