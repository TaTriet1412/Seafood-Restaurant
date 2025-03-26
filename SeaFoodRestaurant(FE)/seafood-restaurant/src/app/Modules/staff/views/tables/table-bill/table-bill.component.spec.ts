import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBillComponent } from './table-bill.component';

describe('TableBillComponent', () => {
  let component: TableBillComponent;
  let fixture: ComponentFixture<TableBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
