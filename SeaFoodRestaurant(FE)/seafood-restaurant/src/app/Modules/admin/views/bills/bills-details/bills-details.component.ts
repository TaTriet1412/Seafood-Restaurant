import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common'; // Import essential CommonModules
import {
  CardBodyComponent,
  CardHeaderComponent,
  CardModule,
  ColComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TableDirective, // Import TableDirective for cTable
  TableModule,
  ButtonDirective, // Import ButtonDirective for cButton
} from '@coreui/angular'; // Correct CoreUI imports
import { NumberFormatService } from '../../../../../core/services/numberFormat.service'; // Assuming path is correct
import { FormsModule } from '@angular/forms';
import { OrderSessionService } from '../../../../../core/services/order-session.service';
import { firstValueFrom, timestamp } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../../share/dto/response/order';

// Define interfaces for better type safety (optional but recommended)
interface BillItem {
  id: number;
  dishName: string;
  quantity: number;
  price: number; // Store raw number
}

interface BillLog {
  id: number;
  timestamp: Date; // Use Date object
  action: string;
}

interface BillDetailsInfo {
  id: number;
  tableId: number;
  createdAt: Date;
  paymentTime: Date;
  totalPrice: number; // Store raw total amount if available from backend
  note?: string; // Optional note
  status: string;
}

@Component({
  selector: 'app-bills-details',
  standalone: true,
  imports: [
    CommonModule, // Includes NgIf, NgFor, AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, LowerCasePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe
    RowComponent,
    ColComponent,
    CardModule,
    CardHeaderComponent,
    CardBodyComponent,
    TableModule, // Includes cTable directive
    FormsModule,
    ButtonDirective, // For cButton
    // NgIf, NgFor are already part of CommonModule
  ],
  providers: [
    DatePipe, // Provide DatePipe if not provided globally or elsewhere
    // NumberFormatService should be provided in root or a higher module
  ],
  templateUrl: './bills-details.component.html',
  styleUrls: ['./bills-details.component.scss'] // Use styleUrls (plural)
})
export class BillsDetailsComponent implements OnInit {
  billId: number = -1; // Example Input


  billDetails: BillDetailsInfo | null = null; // To store main bill info
  billItems: BillItem[] = []; // Use the interface
  billLogs: BillLog[] = []; // Use the interface
  displayedLogs: BillLog[] = [];

  showAllLogs: boolean = false;
  readonly maxInitialLogs = 5; // Constant for initial log display limit
  currentNote: string = ''; // Model for the note input

  constructor(
    private url: ActivatedRoute,
    private orderSessionService: OrderSessionService,
    private numberFormatService: NumberFormatService, // Keep if custom formatting is needed beyond pipes
    private datePipe: DatePipe // Inject DatePipe for formatting if needed in logic (template preferred)
  ) { }

  ngOnInit(): void {
    this.billId = Number(this.url.snapshot.paramMap.get('id'));
    this.loadBillData(); // Load data when component initializes
  }

  async loadBillData(): Promise<void> {
    // --- MOCK DATA ---
    // In a real app, fetch this data based on this.billId from a service
    const fetchedBillBase = await firstValueFrom(this.orderSessionService.getBillBase(this.billId))
    console.log(fetchedBillBase)

    this.billDetails = {
      id: this.billId ?? 0,
      tableId: fetchedBillBase.tableId,
      createdAt: new Date(fetchedBillBase.createdAt), // Example date (Month is 0-indexed)
      paymentTime: new Date(fetchedBillBase.paymentTime), // Example date (Month is 0-indexed)
      totalPrice: fetchedBillBase.totalPrice, // Example total (can be recalculated too)
      status: fetchedBillBase.status
    };
    this.currentNote = this.billDetails?.note ?? ''; // Initialize note input

    const fetchedBillDetail = await firstValueFrom(this.orderSessionService.getOrdersByOrderSessionId(this.billId))

    this.billItems = fetchedBillDetail.orderDetails.map((detail, index) => ({
      id: index + 1, // hoặc dùng detail.id nếu muốn giữ nguyên
      dishName: detail.dishName,
      quantity: detail.quantity,
      price: detail.price,
    }));

    const fetchedBillLogs = await firstValueFrom(this.orderSessionService.getListLogOfBill(this.billId))
    console.log(fetchedBillLogs)

    this.billLogs = fetchedBillLogs
      .map((item, index) => ({
        id: index + 1,
        action: item.message,
        timestamp: new Date(item.createdAt)
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // --- END MOCK DATA ---
    this.updateDisplayedLogs(); // Initialize the displayed logs
  }


  // Toggle log visibility
  toggleShowLogs(): void {
    this.showAllLogs = !this.showAllLogs;
    this.updateDisplayedLogs();
  }

  // Update the array bound to the log table
  private updateDisplayedLogs(): void {
    if (this.showAllLogs) {
      this.displayedLogs = [...this.billLogs]; // Show all (create copy)
    } else {
      this.displayedLogs = this.billLogs.slice(0, this.maxInitialLogs); // Show top N
    }
  }

  // Get button text based on state
  getToggleLogButtonText(): string {
    return this.showAllLogs ? 'Ẩn bớt lịch sử' : 'Xem tất cả lịch sử';
  }

  // Placeholder for payment action
  confirmPayment(): void {
    console.log('Xác nhận thanh toán clicked!');
    console.log('Ghi chú:', this.currentNote);
    // Add payment processing logic here (e.g., call API)
  }

  translateStatusBill(status: string) {
    switch (status) {
      case "Ordered":
        return "Gửi yêu cầu cho bếp"
      case "In Progress":
        return "Đang nấu"
      case "Ready To Pay":
        return "Sẵn sàng thanh toán"
      case "Completed":
        return "Hoàn thành"
      default:
        return "Lỗi"
    }
  }
}