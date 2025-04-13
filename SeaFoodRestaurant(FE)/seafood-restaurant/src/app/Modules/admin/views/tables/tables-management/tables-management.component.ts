import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, GutterDirective, RowComponent } from '@coreui/angular';
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service';
import { TableService } from '../../../../../core/services/table.service';
import { firstValueFrom } from 'rxjs';
import { TableRes } from '../../../../../share/dto/response/table-response';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaymentService } from '../../../../../core/services/payment.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { HttpClient } from '@angular/common/http';
import { ModalModule } from '@coreui/angular-pro';
import { ShiftService } from '../../../../../core/services/shift.service';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tables-management',
  standalone: true,
  imports: [
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    CardBodyComponent,
    GutterDirective,
    CommonModule,
    ModalModule,
    FormsModule
  ],
  templateUrl: './tables-management.component.html',
  styleUrls: ['./tables-management.component.scss'],
})
export class TablesManagementComponent implements OnInit {
  isInactivePage = false;
  originalTable: TableRes[] = []
  paymentDetails: any = {};
  currentCode: string = ''; // Mã code hiện tại
  isModalVisible: boolean = false;
  billList: any[] = [] // Danh sách hóa đơn
  isCodeModalVisible: boolean = false; // Trạng thái hiển thị modal mã code
  isOpenTableModalVisible: boolean = false; // Trạng thái hiển thị modal xác nhận mở bàn
  enteredCode: string = ''; // Mã xác nhận người dùng nhập
  secretCode: string = '123456'; // Mã xác nhận (có thể lấy từ API)
  isCodeInvalid: boolean = false; // Trạng thái mã xác nhận không hợp lệ
  tableToOpen: string | null = null; // ID bàn cần mở

  tables = [...this.originalTable]; // Dùng bản sao của danh sách ban đầu

  constructor(
    private orderSessionService: OrderSessionService,
    private tableService: TableService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private snackbarService: SnackBarService,
    private router: Router,
    private navAdminService: NavAdminService,
    private http: HttpClient,
    private shiftService: ShiftService,
  ) { }

  async ngOnInit(): Promise<void> {
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
            next: async (response: any) => {
              const fetchedTables = await firstValueFrom(this.tableService.getTables());
              this.originalTable = fetchedTables;
              this.tables = [...this.originalTable];
              this.snackbarService.notifySuccess(response.message),
              await this.loadData();
              this.setQueryParams()
            },
            error: (response: any) => {
              this.snackbarService.notifySuccess(response.error.message)
            }
          })
      }
    });

    await this.loadData();
  }

  async loadData(): Promise<void> {
    const fetchedTables = await firstValueFrom(this.tableService.getTables());
    const fetchedBills = await firstValueFrom(this.orderSessionService.getAllBillBaseList());

    this.originalTable = fetchedTables;
    this.billList = fetchedBills.map((item) => ({
      tableId: item.tableId,
      totalPrice: item.totalPrice,
      paymentTime: item.paymentTime ? new Date(item.paymentTime) : null,
      createdAt: new Date(item.createdAt),
      status: item.status,
    }));

    // Gắn thông tin paymentTime từ billList vào table
    this.tables = this.originalTable.map((table) => {
      const bill = this.billList.find((bill) => bill.tableId === table.id);
      return {
        ...table,
        paymentTime: bill ? bill.paymentTime : null, // Gắn paymentTime nếu có
      };
    });
  }


  setQueryParams() {
    const qParams: Params = {};
    this.router.navigate([ROUTES.ADMIN.children.TABLE.children.LIST.fullPath], {
      relativeTo: this.route,
      queryParams: qParams,
      queryParamsHandling: ''
    });
  }

  onSelectChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'all') {
      this.tables = [...this.originalTable]; // Hiển thị tất cả các bàn
      this.isInactivePage = false
    } else if (selectedValue === 'active') {
      this.filterActiveTable(true)
      this.isInactivePage = false
    } else if (selectedValue === 'inactive') {
      this.filterActiveTable(false)
      this.isInactivePage = true
    }
  }

  filterActiveTable(flag: boolean): void {
    this.tables = flag ? this.originalTable.filter(table => (this.isActiveTable(table.currentOrderSessionId)))
      : this.originalTable.filter(table => !(this.isActiveTable(table.currentOrderSessionId)));
  }


  goToTableOrder(tableId: string) {
    this.navAdminService.goToTableOrder(tableId);
  }

  openTableModal(tableId: string): void {
    this.tableToOpen = tableId;
    this.isOpenTableModalVisible = true;
    this.enteredCode = ''; // Reset mã nhập
    this.isCodeInvalid = false; // Reset trạng thái lỗi
  }

  closeModal(): void {
    this.isOpenTableModalVisible = false;
    this.tableToOpen = null;
  }

  confirmOpenTable(): void {
    console.log(this.enteredCode)

    this.shiftService.validateSecretCode(this.enteredCode).subscribe({
      next: (response) => {

        this.tables = this.tables.map((table) => {
          if (table.id.toString() === this.tableToOpen) {
            table.currentOrderSessionId = -1;
          }
          return table;
        });

        this.snackbarService.notifySuccess('Bàn đã được mở thành công!');
        this.closeModal();
      },
      error: (err) => {
        this.snackbarService.notifyError(err.error.message);
        this.isCodeInvalid = true; // Hiển thị lỗi nếu mã không đúng
      }
    });

    // if (this.enteredCode === this.secretCode) {
    //   this.tables = this.tables.map((table) => {
    //     if (table.id.toString() === this.tableToOpen) {
    //       table.currentOrderSessionId = -1;
    //     }
    //     return table;
    //   });

    //   this.snackbarService.notifySuccess('Bàn đã được mở thành công!');
    //   this.closeModal();

    //   if (this.isInactivePage) this.filterActiveTable(false);
    // } else {
    //   this.isCodeInvalid = true; // Hiển thị lỗi nếu mã không đúng
    // }
  }

  async closeTable(tableId: string): Promise<void> {
    // Add your logic to handle table closing here
    this.tableService.offTable(Number(tableId)).subscribe({
      next: async (response) => {
        this.snackbarService.notifySuccess(response)
        await (this.loadData());
        if (this.isInactivePage) this.filterActiveTable(false)
      },
      error: (err) => {
        this.snackbarService.notifyError(err);
        console.log(err);
      },
    })

  }

  isActiveTable(currOrderId: number | null) {
    return currOrderId != null;
  }

  async generateCode(): Promise<void> {
    try {
      const response = await firstValueFrom(this.shiftService.getCurrentCode());
      this.currentCode = response;
      this.isCodeModalVisible = true;
    } catch (err: any) {
      this.snackbarService.notifyError(err.error.message);
      console.error(err);
    }
  }

  // Hàm sao chép mã code vào clipboard
  copyCodeToClipboard(): void {
    if (this.currentCode) {
      navigator.clipboard.writeText(this.currentCode).then(
        () => {
          this.snackbarService.notifySuccess('Mã code đã được sao chép!');
        },
        (err) => {
          this.snackbarService.notifyError('Không thể sao chép mã code!');
          console.error('Error copying text: ', err);
        }
      );
    }
  }
}