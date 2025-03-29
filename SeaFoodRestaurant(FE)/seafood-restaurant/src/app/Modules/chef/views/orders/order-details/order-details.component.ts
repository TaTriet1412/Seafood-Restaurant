import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  FormSelectDirective,
  FormFeedbackComponent,
  FormControlDirective,
  FormLabelDirective,
  FormDirective,
  CardFooterComponent,
  BadgeComponent,
  ColDirective,
  TableActiveDirective,
  TableColorDirective,
  CardModule,
} from '@coreui/angular';

import {
  AlignDirective,
  ButtonDirective,
  CollapseDirective,
  IColumn,
  MultiSelectModule,
  SmartPaginationModule,
  SmartTableModule,
  IItem,
  TemplateIdDirective,
} from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';


import { Order } from '../../../../../share/dto/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    SmartPaginationModule,
    ColComponent,
    CardFooterComponent,
    BadgeComponent,
    RowComponent,
    FormSelectDirective,
    FormFeedbackComponent,
    ButtonDirective,
    FormControlDirective,
    FormLabelDirective,
    FormDirective,
    SmartTableModule,
    ColDirective,
    TableActiveDirective,
    TableColorDirective,
    TemplateIdDirective,
    CollapseDirective,
    AlignDirective,
    MultiSelectModule,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})


export class OrderDetailsComponent implements OnInit {
  originOrderData: any;
  ordersDetailData: IItem[] = [];
  loadedData = false;

  columns: (IColumn | string)[] = [
    {
      key: 'id',
      label: 'Mã đơn hàng',
      _style: { width: '20%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'name',
      label: 'Tên món',
      _style: { width: '20%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      _style: { width: '10%' },
    },
    {
      key: 'status',
      _style: { width: '25%' },
      label: 'Trạng thái'
    },
    {
      key: 'accept',
      label: '',
      _style: { width: '10%' },
      sorter: false
    },
    {
      key: 'reject',
      label: '',
      _style: { width: '10%' },
      sorter: false
    }
  ];

  constructor(
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private snackbarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loadDataOrder()
    this.loadedData = true
  }

  loadDataOrder() {
    this.originOrderData = {
      id: 1,
      orders: [
        {
          id: 1,
          orderDetail: [
            {
              id: 1,
              name: 'Phở',
              quantity: 2,
              price: 50000,
              total: this.numberFormatService.formatNumber(100000),
              status: 'Pending',
              _props: { color: 'warning', align: 'middle' }
            },
            {
              id: 2,
              name: 'Cơm gà',
              quantity: 1,
              price: 40000,
              total: this.numberFormatService.formatNumber(40000),
              status: 'Pending',
              _props: { color: 'warning', align: 'middle' }
            },
          ]
        },
        {
          id: 2,
          orderDetail: [
            {
              id: 3,
              name: 'Trà đá',
              quantity: 3,
              price: 10000,
              total: this.numberFormatService.formatNumber(30000),
              status: 'Active',
              _props: { color: 'success', align: 'middle' }
            }
          ]
        }
      ]
    }

    this.ordersDetailData = this.originOrderData.orders.flatMap((order: Order) =>
      order.orderDetail.map((item) => ({
        ...item,
        orderId: order.id
      }))
    );
  }


  translateStatus(status: String) {
    switch (status) {
      case 'Active':
        return 'Đã nấu xong';
      case 'Pending':
        return 'Đang nấu';
      case 'Inactive':
        return 'Chưa gửi yêu cầu';
      case 'Banned':
        return 'Hủy món';
      default:
        return 'Đã gửi yêu cầu';
    }
  }

  getBadge(status: string) {
    switch (status) {
      case 'Active':
        return 'success'; //Đã nấu
      case 'Inactive':
        return 'secondary'; // Chưa gửi thông báo
      case 'Pending':
        return 'warning'; // Đang nấu
      case 'Banned':
        return 'danger'; // Hủy mónmón
      default:
        return 'primary'; // Đã gửi thông báo
    }
  }

  isBlockBtnState(orderDetailId: number): boolean {
    const orderDetail = this.ordersDetailData.find(order => order['id'] === orderDetailId);
    return orderDetail ? orderDetail['status'] === 'Active' || orderDetail['status'] === 'Banned' : false;
  }

  onAccepted() {
    // TODO: thay đổi mảng originOrderData sau khi hòan thành món
  }

  onRejected() {
    // TODO: thay đổi mảng originOrderData sau khi hủy món
  }
  
}
