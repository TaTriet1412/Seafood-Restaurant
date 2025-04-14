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


import { Order } from '../../../../../share/dto/response/order';
import { firstValueFrom } from 'rxjs';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../../../../core/services/table.service';
import { OrderDetailService } from '../../../../../core/services/order-detail.service';
import { OrderNote } from '../../../../../share/dto/response/order-note.response';

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
    BadgeComponent,
    RowComponent,
    ButtonDirective,
    SmartTableModule,
    TableActiveDirective,
    TableColorDirective,
    TemplateIdDirective,
    AlignDirective,
    MultiSelectModule,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})


export class OrderDetailsComponent implements OnInit {
  originOrderData: any;
  loadedData = false;
  orderSessionStatus = "";
  currOrderSessionId: number = -1;

  tableId: number = -1;
  ordersData: IItem[] = [];
  notes: { text: string; createdAt: Date }[] = [];
  showAllNotes: boolean = false;

  columns: (IColumn | string)[] = [
    {
      key: 'dishName',
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
      _style: { width: '22%' },
      label: 'Trạng thái'
    },
    {
      key: 'accept',
      _style: { width: '22%' },
      label: 'Hành động',
      filter: false,
      sorter: false
    }
  ];

  constructor(
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private orderSessionService: OrderSessionService,
    private orderDetailService: OrderDetailService,
    private snackbarService: SnackBarService,
    private url: ActivatedRoute,
    private tableService: TableService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.currOrderSessionId = Number(this.url.snapshot.paramMap.get('id'));
    await this.loadDataOrder()

    this.loadedData = true
  }

  async loadDataOrder() {
    const fetchedOrdersData = await firstValueFrom(this.orderSessionService.getOrdersByOrderSessionId(this.currOrderSessionId));
    this.orderSessionStatus = fetchedOrdersData.status
    this.tableId = fetchedOrdersData.tableId

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
        case 'Finished':
          color = 'success';
          break;
      }

      return {
        ...item,
        _props: {
          align: 'middle',
          color,
        }
      };
    }) || [];

    const fetchedOrderNotesData = await firstValueFrom(this.orderSessionService.getOrderNotesByOrderSessionId(this.currOrderSessionId));
    this.notes = fetchedOrderNotesData
      .filter((item: OrderNote) => item.note && item.note.trim() !== '') // Lọc bỏ các note null hoặc blank
      .map((item: OrderNote) => ({
        text: item.note,
        createdAt: new Date(item.createdAt),
      }));
  }



  getBadge(status: string) {
    switch (status) {
      case 'Finished':
        return 'success'; //Đã nấu
      case 'Ordered':
        return 'primary'; // Đã gửi thông báo
      case 'Cooking':
        return 'warning'; // Đang nấu
      default:
        return 'secondary'; // Chưa gửi thông báo
    }
  }

  translateStatus(status: String) {
    switch (status) {
      case 'Finished':
        return 'Đã nấu xong';
      case 'Cooking':
        return 'Đang nấu';
      case 'Ordered':
        return 'Đã gửi yêu cầu';
      default:
        return 'Chưa gửi yêu cầu';
    }
  }

  isBlockBtnState(orderDetailId: number): boolean {
    const orderDetail = this.ordersData.find(order => order['id'] === orderDetailId);
    return orderDetail ? orderDetail['status'] === 'Finished' || orderDetail['status'] === 'Banned' : false;
  }

  async onAccepted(id: number) {
    this.loadedData = false;
    const data = await firstValueFrom(this.orderDetailService.updateOrderDetail(id));
    await this.loadDataOrder()
    this.loadedData = true;

  }

  get sortedNotes() {
    return this.notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  toggleShowAllNotes(): void {
    this.showAllNotes = !this.showAllNotes;
  }
}
