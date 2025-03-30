import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsDateComponent } from './bills-date.component';

describe('BillsDateComponent', () => {
  let component: BillsDateComponent;
  let fixture: ComponentFixture<BillsDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
