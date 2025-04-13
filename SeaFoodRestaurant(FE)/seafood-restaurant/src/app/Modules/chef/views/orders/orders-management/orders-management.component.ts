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
  IItem,
  MultiSelectModule,
  SmartPaginationModule,
  SmartTableModule,
  TemplateIdDirective,
} from '@coreui/angular-pro';
import { NumberFormatService } from '../../../../../core/services/numberFormat.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { NavChefService } from '../../../../../core/services/nav-routing/nav-chef.service';
import { firstValueFrom } from 'rxjs';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { OrderSessionRes } from '../../../../../share/dto/response/order_session-response';



@Component({
  selector: 'app-orders-management',
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
    RowComponent,
    ButtonDirective,
    SmartTableModule,
    ColDirective,
    TableActiveDirective,
    TableColorDirective,
    TemplateIdDirective,
    AlignDirective,
    MultiSelectModule,
  ],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.scss'
})
export class OrdersManagementComponent implements OnInit {
  loadedData = false;
  ordersSessionData: IItem[] = [];
  orderSessionDataRaw: OrderSessionRes[] = [];


  columns: (IColumn | string)[] = [
    {
      key: 'id',
      label: 'Mã đơn hàng',
      _style: { width: '10%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'table_id',
      label: 'Số bàn',
      _style: { width: '10%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'created_at',
      label: 'Thời gian tạo',
      _style: { width: '15%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      _style: { width: '15%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'show',
      label: '',
      _style: { width: '6%' },
      filter: false,
      sorter: false
    }
  ];

  constructor(
    private orderSessionService: OrderSessionService,
    private navChefService: NavChefService,
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private snackbarService: SnackBarService,
  ) { }

  async ngOnInit(): Promise<void> {
    const fetchedOrdersData = await firstValueFrom(this.orderSessionService.getOrdersInProgressOrOrdered())
    this.orderSessionDataRaw = fetchedOrdersData;
    this.loadDataOrdersSession()
    this.loadedData = true;
  }

  loadDataOrdersSession() {
    this.ordersSessionData = this.orderSessionDataRaw.map((order: OrderSessionRes) => ({
      id: order.orderSessionId,
      table_id: order.tableId,
      created_at: order.createAt,
      status: order.status
    }));
    console.log(this.ordersSessionData)
  }

  translateStatus(status: string) {
    switch (status) {
      case "In Progress":
        return "Đang nấu"
      case "Ordered":
        return "Khách gọi món"
      default:
        return ""
    }
  }

  async handleClick(item: IItem) {
    if (item['status'] == 'In Progress') {
      this.goToOrderDetail(item['id'].toString())
    } else {
      this.loadedData = false;
      await firstValueFrom (this.orderSessionService.updateAllOrderDetailsToCooking(item['id']))
      const fetchedOrdersData = await firstValueFrom(this.orderSessionService.getOrdersInProgressOrOrdered())
      this.orderSessionDataRaw = fetchedOrdersData;
      this.loadDataOrdersSession()
      this.loadedData = true;
    }
  }

  goToOrderDetail(orderID: string) {
    this.navChefService.goToOrderDetail(orderID)
  }
}