import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardHeaderComponent, CardModule, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableModule, TextColorDirective } from '@coreui/angular';
import { ColComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-bill',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardModule,
    TableModule,
    CommonModule,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective
  ],
  templateUrl: './table-bill.component.html',
  styleUrl: './table-bill.component.scss'
})
export class TableBillComponent implements OnInit {
  bills: any[] = [];


  constructor(
    private numberFormatService: NumberFormatService
  ) { }

  ngOnInit(): void {
    this.loadBill()
  }


  loadBill() {
    this.bills = [
      {
        id: 1,
        name: 'Phở',
        quantity: 2,
        price: 50000,
        total: this.numberFormatService.formatNumber(100000),
        _props: { color: 'warning', align: 'middle' }
      },
      {
        id: 2,
        name: 'Cơm gà',
        quantity: 1,
        price: 40000,
        total: this.numberFormatService.formatNumber(40000),
        _props: { color: 'warning', align: 'middle' }
      },
      {
        id: 3,
        name: 'Trà đá',
        quantity: 3,
        price: 10000,
        total: this.numberFormatService.formatNumber(30000),
        _props: { color: 'success', align: 'middle' }
      }
    ];
  }


  getTotalPrice(): string {
    const totalPrice = this.bills.reduce((total, order) => total + order['price']*order['quantity'],0);  
    return this.numberFormatService.formatNumber(totalPrice)
  }
}
