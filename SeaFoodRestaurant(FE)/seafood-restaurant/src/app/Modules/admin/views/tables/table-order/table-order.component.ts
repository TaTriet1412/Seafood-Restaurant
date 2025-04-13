// * Mảng order và menu chưa được chỉnh theo BE
// ! nextID là ví dụ có vị trí order cần được điều chỉnh



import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  ModalModule,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalComponent,
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
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';
import { CategoryRes } from '../../../../../share/dto/response/category-response';
import { firstValueFrom } from 'rxjs';
import { DishRes } from '../../../../../share/dto/response/dish-response';
import { DishService } from '../../../../../core/services/dish.service';
import { TableService } from '../../../../../core/services/table.service';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { CreateOrder } from '../../../../../share/dto/request/create-order';
import { DetailOrderReq } from '../../../../../share/dto/request/detail-order-req';
import { OrderDetail } from '../../../../../share/dto/response/order_detail';
import { OrderService } from '../../../../../core/services/order.service';
import { Order } from '../../../../../share/dto/response/order';

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
    ModalModule,
    CardBodyComponent,
    CardHeaderComponent,
    InputGroupComponent,
    InputGroupTextDirective,
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
export class TableOrderComponent implements OnInit, OnDestroy {
  @ViewChild('staticBackdropModal') staticBackdropModal!: ModalComponent;
  currTableId: number = -1;
  currOrderSessionId: number = -1;
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
  categoryList: CategoryRes[] = []
  dishList: DishRes[] = []
  filteredDishes: DishRes[] = []
  currItemToggleBody: any = null //biến item đang được mở hiện tại trong bảng
  detailOrders: DetailOrderReq[] = []
  noteCreateOrder = ""
  createOrderList: CreateOrder = {
    tableId: -1,
    orderSessionId: this.currOrderSessionId,
    note: this.noteCreateOrder,
    items: this.detailOrders
  };
  orderSessionStatus = "";


  ordersData: IItem[] = [];

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
      key: 'total',
      label: 'Tổng tiền',
      _style: { width: '15%' },
    },
    {
      key: 'status',
      _style: { width: '22%' },
      label: 'Trạng thái'
    },
    {
      key: 'show',
      label: '',
      _style: { width: '8%' },
      filter: false,
      sorter: false
    }
  ];

  constructor(
    private orderSessionService: OrderSessionService,
    private orderService: OrderService,
    private tableService: TableService,
    private categoryService: CategoryService,
    private dishService: DishService,
    private url: ActivatedRoute,
    private navAdminService: NavAdminService,
    private numberFormatService: NumberFormatService,
    private cdf: ChangeDetectorRef,
    private snackbarService: SnackBarService,
  ) { }

  // Kiểm tra trước khi thoát trang
  canDeactivate(): boolean {
    if (this.createOrderList.items.length > 0) {
      return confirm('Bạn có chắc chắn muốn thoát không? Dữ liệu sẽ bị mất.');
    }
    return true;
  }


  async ngOnInit(): Promise<void> {
    this.currTableId = Number(this.url.snapshot.paramMap.get('id'));
    const fetchedTable = await firstValueFrom(this.tableService.getTableById(this.currTableId))
    if (fetchedTable.currentOrderSessionId != null) {
      this.currOrderSessionId = fetchedTable.currentOrderSessionId!;
      await this.loadDataOrder()
    }
    this.createOrderList.orderSessionId = this.currOrderSessionId;
    this.createOrderList.tableId = this.currTableId

    this.nextId = this.ordersData.length + 1;
    this.loadedData = true;

    const fetchedCategories = await firstValueFrom(this.categoryService.getCategories())
    this.categoryList = fetchedCategories;


    // Dùng mảng  này nếu chỉ dùng phần tử bên trong
    // this.statusList = [...new Set(this.ordersData.map((item) => item['status']))];

    // Dùng mảng này nếu cố định
    this.statusList = ['Finished', 'Ordered', 'Cooking', '']

    this.cdf.detectChanges();
  }


  async loadDataOrder() {
    const fetchedOrdersData = await firstValueFrom(this.orderSessionService.getOrdersByOrderSessionId(this.currOrderSessionId));
    this.orderSessionStatus = fetchedOrdersData.status
    console.log(this.orderSessionStatus)

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
        total,
        _props: {
          align: 'middle',
          color,
        }
      };
    }) || [];

  }

  onCategoryChange(event: Event) {
    this.selectedDish = ''; // Reset dish selection when category changes
    const category = this.categoryList.find(c => c.name == this.selectedCategory)
    this.dishService.getDishesByCatIdAbleTrue(category?.id!)
      .subscribe({
        next: (res: DishRes[]) => this.filteredDishes = res
      })
  }

  onSubmit(form: NgForm) {
    this.validated = true;
    this.submitted = true;

    if (form.valid) {
      // Bật nút để thông báo cho bếp
      this.isNotifyKitchen = false;

      const dish = this.getSelectedDish();
      if (dish) {
        // Tìm xem món đã có trong ordersData chưa và trạng thái là Inactive (dựa trên name hoặc value)
        const existingOrderIndex = this.ordersData.findIndex(
          order => (order['dishName'] === dish.name) && order['status'] == "Inactive"
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

          this.addDetailDishToCreateOrderList(dish.id, this.quantity)

        } else {
          // Nếu món chưa tồn tại, thêm mới
          const newOrder: IItem = {
            id: this.nextId++,
            dishId: dish.id,
            dishName: dish.name,
            quantity: this.quantity,
            price: dish.price,
            total: this.numberFormatService.formatNumber(dish.price * this.quantity),
            status: 'Inactive',
            _props: { color: 'secondary', align: 'middle' }
          };

          this.ordersData = [...this.ordersData, newOrder];
          this.addDetailDishToCreateOrderList(dish.id, this.quantity)
        }

        this.onReset();
      }
    }
  }



  addDetailDishToCreateOrderList(id: number, quantity: number) {
    const existingItem = this.createOrderList.items.find(item => item.dishId === id);
    console.log(existingItem)

    if (existingItem) {
      // Nếu đã tồn tại, cộng thêm số lượng
      existingItem.quantity += quantity;
      this.createOrderList.items = this.createOrderList.items.map(item => {
        if (item.dishId === id) {
          return {
            ...item,
            quantity: existingItem.quantity
          };
        }
        return item;
      })
    }else {
      this.createOrderList.items.push({
        dishId: id,
        quantity: quantity
      });
    }
      // Nếu chưa tồn tại, thêm mới vào danh sách

    console.log(this.createOrderList.items)
    this.updateNotifyKitchenStatus();
  }
  changeQuantityOfDetailDish(dishId: number, quantity: number): void {
    if (quantity < 1) {
      this.snackbarService.notifyError('Số lượng không được nhỏ hơn 1!');
      return;
    }

    const item = this.createOrderList.items.find(i => i.dishId === dishId);
    if (item) {
      item.quantity = quantity;
    } else {
      console.warn(`Không tìm thấy món có dishId = ${dishId} trong danh sách`);
    }

    console.log(this.createOrderList.items)
    this.updateNotifyKitchenStatus();
  }

  // Sự kiện thay đổi số lượng món
  changeQuantitySubmit(form: NgForm, orderId: number) {
    if (this.quantityToChange < 1) {
      this.snackbarService.notifyError('Số lượng không được nhỏ hơn 1!');
      return;
    }
    this.validatedChange = true;
    let currOrderDetail: any = this.ordersData.find(orderDetail => orderDetail['id'] == orderId)

    let updatedOrders = [...this.ordersData];

    this.ordersData = this.ordersData.map(o => {
      return {
        ...o,
        quantity: o['id'] == orderId ? this.quantityToChange : o['quantity'],
        total: o['id'] == orderId ? this.numberFormatService.formatNumber(this.quantityToChange * o['price']) : o['total']
      }
    })
    this.updateNotifyKitchenStatus();
    //Gọi server thay đổi món

    if (currOrderDetail['quantity'] != this.quantityToChange) {
      this.isNotifyKitchen = false;
    }

    this.changeQuantityOfDetailDish(currOrderDetail['dishId'], this.quantityToChange)

    this.snackbarService.notifySuccess("Thay đổi số lượng thành công")

  }

  deleteOrder(orderId: number) {
    let currOrder: any = this.ordersData.find(order => order['id'] === orderId);

    if (currOrder && currOrder['status'] === 'Inactive') {
      this.ordersData = this.ordersData.filter(order => order['id'] !== orderId);
      this.createOrderList.items =
        this.createOrderList.items
          .filter(item => item.dishId !== currOrder['dishId'])
      console.log(this.createOrderList.items)
      this.updateNotifyKitchenStatus();
      return;
    }

    this.snackbarService.notifyError("Chỉ có thể xóa khi chưa gửi thông báo");
  }

  onReset() {
    this.validated = false;
    this.selectedCategory = '';
    this.selectedDish = '';
    this.quantity = 1;
    this.submitted = false;
    this.formData = null;
  }

  onResetCreateOrder() {
    this.detailOrders = []
    this.noteCreateOrder = ""
    this.createOrderList = {
      tableId: this.currTableId,
      orderSessionId: this.currOrderSessionId,
      note: this.noteCreateOrder,
      items: this.detailOrders
    };
  }


  private getSelectedDish(): DishRes | undefined {
    const dish = this.filteredDishes.find(d => d.name == this.selectedDish)
    return dish;
  }
  
  getRowIndex(index: any): number {
    return Number.parseInt(index) + 1;
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

  getItem(item: any) {
    return Object.keys(item);
  }

  details_visible = Object.create({});

  // Sử lí sự kiến nhất nút show
  toggleDetails(item: any) {
    this.currItemToggleBody = item;
    this.details_visible[item] = !this.details_visible[item];
    let currOrder = this.ordersData.find(order => order['id'] == item)
    this.quantityToChange = currOrder!['quantity'];
  }

  //Sự kiện nhấn nút thông báo nhà bếp
  async onKitchenNotification() {
    try {
      this.createOrderList.note = this.noteCreateOrder.toString()
      const fetchedOrder: Order = await firstValueFrom(this.orderService.handleNewOrder(this.createOrderList))
      this.currOrderSessionId = fetchedOrder.orderSessionId

      console.log(this.currOrderSessionId)

      this.onResetCreateOrder()

      await this.loadDataOrder()
      this.snackbarService.notifySuccess("Gửi thông báo thành công")
      this.staticBackdropModal.visible = false;
      this.isNotifyKitchen = true
      this.cdf.detectChanges()
    } catch (error: any) {
      this.snackbarService.notifyError(error.error.message)
    }

  }

  // Lấy tổng giá tiền 
  getTotalPrice(): string {
    const totalPrice = this.ordersData.reduce((total, order) => {
      return order['status'] !== 'Cancelled'
        ? total + order['price'] * order['quantity']
        : total;
    }, 0);
    return this.numberFormatService.formatNumber(totalPrice)
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
      const selected: any = [...$event];
      this.selectedStatus = selected;
      const filterFunction = (item: any) => selected.includes(item);
      this.columnFilterValue = { ...columnFilterValue, status: filterFunction };
      return;
    }
    delete columnFilterValue.status;
    this.columnFilterValue = { ...columnFilterValue };
  }

  goToTableBill() {
    this.navAdminService.goToTableBill(this.currTableId.toString())
  }

  private updateNotifyKitchenStatus(): void {
    // Nếu danh sách items rỗng, bật trạng thái thông báo
    this.isNotifyKitchen = this.createOrderList.items.length === 0;
  }

  ngOnDestroy(): void {
    window.onbeforeunload = null;
  }
}