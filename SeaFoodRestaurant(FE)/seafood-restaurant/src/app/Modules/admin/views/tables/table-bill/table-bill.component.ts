import { Component, OnInit } from '@angular/core';
import { BadgeModule, CardBodyComponent, CardHeaderComponent, CardModule, FormControlDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TableModule, TextColorDirective } from '@coreui/angular';
import { ColComponent } from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../../../core/services/payment.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { ROUTES } from '../../../../../core/constants/routes.constant';

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
    FormControlDirective,
    BadgeModule,
  ],
  templateUrl: './table-bill.component.html',
  styleUrl: './table-bill.component.scss'
})
export class TableBillComponent implements OnInit {
  bills: any[] = [];
  currBillId = 1;
  paymentDetails: any = {};
  isPaid: boolean = false;

  constructor(
    private snackbarService: SnackBarService,
    private numberFormatService: NumberFormatService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['vnp_OrderInfo'] && params['vnp_PayDate'] && params['vnp_TransactionNo'] &&
        params['vnp_Amount'] && params['vnp_TxnRef'] && params['vnp_ResponseCode']) {
        this.paymentDetails = {
          vnp_OrderInfo: params['vnp_OrderInfo'],
          vnp_PayDate: params['vnp_PayDate'],
          vnp_TransactionNo: params['vnp_TransactionNo'],
          vnp_Amount: params['vnp_Amount'],
          vnp_TxnRef: params['vnp_TxnRef'],
          vnp_ResponseCode: params['vnp_ResponseCode'],
          vnp_BankCode: params["vnp_BankCode"],
          vnp_BankTranNo: params["vnp_BankTranNo"],
          vnp_CardType: params["vnp_CardType"]
        };

        this.paymentService.sendPaymentResult(this.paymentDetails)
          .subscribe({
            next: (response: any) => {
              this.snackbarService.notifySuccess(response.message),
              this.setQueryParams()
            },
            error: (response: any) => {
              this.snackbarService.notifySuccess(response.error.message)
            }
          })
      }
    });
    this.loadBill()
  }

  setQueryParams() {
    const qParams: Params = {};
    this.router.navigate([ROUTES.ADMIN.children.TABLE.children.BILL.fullPath("1")], {
      relativeTo: this.route,
      queryParams: qParams,
      queryParamsHandling: ''
    });
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


  getTotalPrice(): string {
    const totalPrice = this.getTotalPriceInt();
    return this.numberFormatService.formatNumber(totalPrice)
  }

  getTotalPriceInt(): number {
    return this.bills.reduce((total, order) => total + order['price'] * order['quantity'], 0);
  }

  submitRecharge() {
    const orderInfo = `Thanh toán tiền hóa đơn ${this.currBillId}`
    const reBackUrl = ROUTES.ADMIN.children.TABLE.children.BILL.fullPath("1");

    this.paymentService.payByVnPay(this.getTotalPriceInt(), orderInfo, this.currBillId, reBackUrl)
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
