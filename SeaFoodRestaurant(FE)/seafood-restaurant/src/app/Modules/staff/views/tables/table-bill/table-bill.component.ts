import { Component, OnInit } from '@angular/core';
import { BadgeModule, CardBodyComponent, CardHeaderComponent, CardModule, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableModule, TextColorDirective } from '@coreui/angular';
import { ColComponent, IItem } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../../../core/services/payment.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { firstValueFrom } from 'rxjs';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { TableService } from '../../../../../core/services/table.service';

@Component({
  selector: 'app-table-bill',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardModule,
    TableModule,
    CommonModule,
    BadgeModule,
  ],
  templateUrl: './table-bill.component.html',
  styleUrl: './table-bill.component.scss'
})
export class TableBillComponent implements OnInit {
  bills: any[] = [];
  currTableId = -1;
  currOrderSessionId = -1;
  paymentDetails: any = {};
  isPaid: boolean = false;
  ordersData: any[] = [];
  orderSessionStatus = "";

  constructor(
    private snackbarService: SnackBarService,
    private tableService: TableService, 
    private orderSessionService: OrderSessionService,
    private url: ActivatedRoute,
    private numberFormatService: NumberFormatService,
    private paymentService: PaymentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currTableId = Number(this.url.snapshot.paramMap.get('id'));
    const fetchedTable = await firstValueFrom(this.tableService.getTableById(this.currTableId))
    this.currOrderSessionId = fetchedTable.currentOrderSessionId!;

    await this.loadDataOrder()

    this.loadBill()
  }

  async loadDataOrder() {
    const fetchedOrdersData = await firstValueFrom(this.orderSessionService.getOrdersByOrderSessionId(this.currOrderSessionId));
    this.orderSessionStatus = fetchedOrdersData.status

    this.ordersData = fetchedOrdersData?.orderDetails?.map((item: any) => {
      const total = this.numberFormatService.formatNumber(item.price * item.quantity);

      // Gán màu theo status
      let color = 'secondary';
      switch (item.status) {
        case 'Ordered':
          color = 'info';
          break;
        case 'Cooking':
          color = 'warning';
          break;
        case 'Cancelled':
          color = 'danger';
          break;
        case 'Finished':
          color = 'success';
          break;
      }

      return {
        ...item,
        total,
        _props: {
          align: 'middle',
          color,
        }
      };
    }) || [];

  }

  loadBill() {
    this.bills = [
      {
        id: 1,
        name: 'Phở',
        quantity: 2,
        price: 50000,
        total: this.numberFormatService.formatNumber(100000),
      },
      {
        id: 2,
        name: 'Cơm gà',
        quantity: 1,
        price: 40000,
        total: this.numberFormatService.formatNumber(40000),
      },
      {
        id: 3,
        name: 'Trà đá',
        quantity: 3,
        price: 10000,
        total: this.numberFormatService.formatNumber(30000),
      }
    ];
  }

  translateStatus(status: String) {
    switch (status) {
      case 'Finished':
        return 'Đã nấu xong';
      case 'Cooking':
        return 'Đang nấu';
      case 'Ordered':
        return 'Đã gửi yêu cầu';
      case 'Cancelled':
        return 'Hủy món';
      default:
        return 'Chưa gửi yêu cầu';
    }
  }


  getTotalPrice(): string {
    return this.numberFormatService.formatNumber(this.getTotalPriceInt());
  }

  getTotalPriceInt(): number {
    return this.ordersData.reduce((total, order) => total + Number.parseInt(order['total'].replace(/\./g, '')) , 0)
  }

  submitRecharge() {
    const orderInfo = `Thanh toán tiền hóa đơn ${this.currOrderSessionId}`
    const reBackUrl = ROUTES.STAFF.children.TABLE.children.LIST.fullPath;

    this.paymentService.payByVnPay(this.getTotalPriceInt(), orderInfo, this.currOrderSessionId, reBackUrl)
      .subscribe({
        next: (response: any) => {
          if (response.redirectUrl) {
            window.location.href = response.redirectUrl;
          }
        },
        error: (response: any) => console.log(response)
      })
  }


  get paymentStatusDisplay(): string {
    return this.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán';
  }
}
