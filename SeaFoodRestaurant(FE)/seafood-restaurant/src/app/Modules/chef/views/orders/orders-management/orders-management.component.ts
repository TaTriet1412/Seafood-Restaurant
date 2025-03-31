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


  columns: (IColumn | string)[] = [
    {
      key: 'id',
      label: 'Mã đơn hàng',
      _style: { width: '10%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'note',
      label: 'Ghi chú',
      _style: { width: '25%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'created_at',
      label: 'Thời gian tạo',
      _style: { width: '15%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'description',
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
    private navChefService: NavChefService,
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private snackbarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loadDataOrdersSession()
    this.loadedData = true;
  }

  loadDataOrdersSession(){
    this.ordersSessionData = [
      {
        id: 1,
        note: "Khách không muốn ăn rau",
        created_at: "2024-03-29T14:30:45Z",
        status: "Pending", // chưa nấu, đang nấu, đã nấu,
        description: "5 món đang nấu"
      },
      {
        id: 2,
        note: "Khách muốn có cơm thêm",
        created_at: "2024-03-29T14:30:45Z",
        status: "", // chưa nấu
        description: "1 món chưa nấu"
      }
    ]

  }

  handleClick(item : IItem) {
    if(item['status'] == 'Pending') {
      this.goToOrderDetail(item['id'].toString())
    }
  }

  goToOrderDetail(orderID: string) {
    this.navChefService.goToOrderDetail(orderID)
  }
}