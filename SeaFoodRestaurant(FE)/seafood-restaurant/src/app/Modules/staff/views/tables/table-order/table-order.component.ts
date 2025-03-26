// * Mảng order và menu chưa được chỉnh theo BE
// ! nextID là ví dụ có vị trí order cần được điều chỉnh

 

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

interface Dish {
  name: string;
  value: string;
  price: number;
}

interface MenuCategory {
  name: string;
  value: string;
  dishes: Dish[];
}

@Component({
  selector: 'app-table-order',
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
  templateUrl: './table-order.component.html',
  styleUrls: ['./table-order.component.scss'],
})
export class TableOrderComponent implements OnInit {
  selectedCategory: string = '';
  selectedDish: string = '';
  quantity: number = 1;
  quantityToChange: number = 0;
  submitted = false;
  formData: any;
  validated = false;
  validatedChange = false;
  loadedData = false;
  nextId = 1;
  isNotifyKitchen = true;
  selectedStatus = []; //mảng trạng thái được chọn 
  statusList: any[] = []; //Mảng chứa tất cả trạng thái



  // Menu data structure
  menuCategories: MenuCategory[] = [
    {
      name: 'Món chính',
      value: 'mainDish',
      dishes: [
        { name: 'Phở', value: 'pho', price: 50000 },
        { name: 'Cơm', value: 'com', price: 40000 },
        { name: 'Bún chả', value: 'bunCha', price: 45000 }
      ]
    },
    {
      name: 'Tráng miệng',
      value: 'dessert',
      dishes: [
        { name: 'Chè', value: 'che', price: 20000 },
        { name: 'Bánh', value: 'banh', price: 25000 },
        { name: 'Kem', value: 'kem', price: 30000 }
      ]
    },
    {
      name: 'Đồ uống',
      value: 'drink',
      dishes: [
        { name: 'Trà đá', value: 'traDa', price: 10000 },
        { name: 'Nước ngọt', value: 'nuocNgot', price: 20000 },
        { name: 'Sinh tố', value: 'sinhTo', price: 35000 }
      ]
    }
  ];

  ordersData: IItem[] = [];

  columns: (IColumn | string)[] = [
    {
      key: 'name',
      label: 'Tên món',
      _style: { width: '20%' },
      _props: {  class: 'fw-bold' }
    },
    {
      key: 'quantity',
      label: 'Số lượng',
      _style: { width: '10%' },
    },
    {
      key: 'total',
      label: 'Tổng tiền',
      filter: false,
      sorter: false,
      _style: { width: '15%' },
    },
    { key: 'status',
      _style: { width: '25%' },
      label: 'Trạng thái'
    },
    {
      key: 'show',
      label: '',
      _style: { width: '5%' },
      filter: false,
      sorter: false
    }
  ];

  constructor(
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private snackbarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.loadDataOrder()
    this.nextId = this.ordersData.length + 1;
    this.loadedData = true;

    // Dùng mảng  này nếu chỉ dùng phần tử bên trong
    // this.statusList = [...new Set(this.ordersData.map((item) => item['status']))];
    
    // Dùng mảng này nếu cố định
    this.statusList = ['Active','Inactive','Pending','Banned','']
    this.cdf.detectChanges();
  }

  loadDataOrder() {
    this.ordersData = [
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
      {
        id: 3,
        name: 'Trà đá',
        quantity: 3,
        price: 10000,
        total: this.numberFormatService.formatNumber(30000),
        status: 'Active',
        _props: { color: 'success', align: 'middle' }
      }
    ];
    
  }

  get filteredDishes() {
    const category = this.menuCategories.find(c => c.value === this.selectedCategory);
    return category ? category.dishes : [];
  }

  onCategoryChange(event: Event) {
    this.selectedDish = ''; // Reset dish selection when category changes
  }

  onSubmit(form: NgForm) {
    this.validated = true;
    this.submitted = true;
    
    if (form.valid) {
      // Bật nút để thông báo cho bếp
      this.isNotifyKitchen = false;


      const dish = this.getSelectedDish();
      if (dish) {
        // Tìm xem món đã có trong ordersData chưa (dựa trên name hoặc value)
        const existingOrderIndex = this.ordersData.findIndex(
          order => order['name'] === dish.name
        );
  
        if (existingOrderIndex !== -1) {
          // Nếu món đã tồn tại, cập nhật số lượng và trạng thái
          const updatedOrders = [...this.ordersData];
          updatedOrders[existingOrderIndex] = {
            ...updatedOrders[existingOrderIndex],
            quantity: updatedOrders[existingOrderIndex]['quantity'] + this.quantity,
            total: this.numberFormatService.formatNumber(
              (updatedOrders[existingOrderIndex]['quantity'] + this.quantity) * 
              updatedOrders[existingOrderIndex]['price']
            ),
            status: 'Inactive',
            _props: { color: 'secondary', align: 'middle' }
          };
          
          this.ordersData = updatedOrders;
        } else {
          // Nếu món chưa tồn tại, thêm mới
          const newOrder: IItem = {
            id: this.nextId++,
            name: dish.name,
            quantity: this.quantity,
            price: dish.price,
            total: this.numberFormatService.formatNumber(dish.price * this.quantity),
            status: 'Inactive',
            _props: { color: 'secondary', align: 'middle' }
          };
          
          this.ordersData = [...this.ordersData, newOrder];
        }
        
        this.onReset();
      }
    }
  }

  // Sự kiện thay đổi số lượng món
  changeQuantitySubmit(form: NgForm, orderId: number) {
    this.validatedChange = true;
    let currOrder:any = this.ordersData.find(order => order['id'] == orderId)

    //Gọi server thay đổi món

    if(currOrder['quantity'] != this.quantityToChange) {
      this.isNotifyKitchen = false;
    }
    // TODO: Cập nhật danh sách ordersData

    this.snackbarService.notifySuccess("Thay đổi số lượng thành công")

  }

  deleteOrder(orderId: number) {
    let currOrder: any = this.ordersData.find(order => order['id'] === orderId);
    
    if (currOrder && currOrder['status'] === 'Inactive') {
      this.ordersData = this.ordersData.filter(order => order['id'] !== orderId);
      return;
    }
    this.snackbarService.notifyError("Chỉ có thể xóa khi chưa gửi thông báo")
  }

  onReset() {
    this.validated = false;
    this.selectedCategory = '';
    this.selectedDish = '';
    this.quantity = 1;
    this.submitted = false;
    this.formData = null;
  }

  private getSelectedDish(): Dish | undefined {
    for (const category of this.menuCategories) {
      const dish = category.dishes.find(d => d.value === this.selectedDish);
      if (dish) return dish;
    }
    return undefined;
  }

  getRowIndex(index: any): number {
    return Number.parseInt(index) + 1;
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
        return 'danger';
      default:
        return 'primary'; // Đã gửi thông báo
    }
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

  getItem(item: any) {
    return Object.keys(item);
  }

  details_visible = Object.create({});

  // Sử lí sự kiến nhất nút show
  toggleDetails(item: any) {
    this.details_visible[item] = !this.details_visible[item];
    let currOrder = this.ordersData.find(order => order['id'] == item)
    this.quantityToChange = currOrder!['quantity'];
  }

  //Sự kiện nhấn nút thông báo nhà bếp
  onKitchenNotification() {
    this.isNotifyKitchen = true

    // Giả sử đã gửi thông báo
    this.ordersData = this.ordersData.map(order => {
      return {
        ...order, 
        status: order['status'] === 'Inactive' ? '' : order['status']
      };
    });
    this.snackbarService.notifySuccess("Gửi thông báo thành công")
    this.cdf.detectChanges()
  }

  //Lọc dữ liệu cố định
  set columnFilterValue(value) {
    this._columnFilterValue = { ...value };
    if (!Object.entries(value).length) {
      this.selectedStatus = [];
    }
  }

  get columnFilterValue() {
    return this._columnFilterValue;
  }

  private _columnFilterValue: any = {};

  handleValueChange($event: any) {
    const columnFilterValue = { ...this.columnFilterValue };
    if ($event?.length) {
      const selected:any = [...$event];
      this.selectedStatus = selected;
      const filterFunction = (item: any) => selected.includes(item);
      this.columnFilterValue = { ...columnFilterValue, status: filterFunction };
      return;
    }
    delete columnFilterValue.status;
    this.columnFilterValue = { ...columnFilterValue };
  }
} 