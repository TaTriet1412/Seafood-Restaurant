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

// Define interfaces for better type safety (optional but recommended)
interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number; // Store raw number
}

interface BillLog {
  id: number;
  timestamp: Date; // Use Date object
  action: string;
  user: string;
}

interface BillDetailsInfo {
    id: number;
    tableName: string;
    staffName: string;
    createdAt: Date;
    totalAmount: number; // Store raw total amount if available from backend
    note?: string; // Optional note
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
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
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

  // Assume billId is passed in via input or route parameter
  @Input() billId: number | null = 123; // Example Input

  billDetails: BillDetailsInfo | null = null; // To store main bill info
  billItems: BillItem[] = []; // Use the interface
  billLogs: BillLog[] = []; // Use the interface
  displayedLogs: BillLog[] = [];

  showAllLogs: boolean = false;
  readonly maxInitialLogs = 5; // Constant for initial log display limit
  currentNote: string = ''; // Model for the note input

  constructor(
    private numberFormatService: NumberFormatService, // Keep if custom formatting is needed beyond pipes
    private datePipe: DatePipe // Inject DatePipe for formatting if needed in logic (template preferred)
  ) {}

  ngOnInit(): void {
    this.loadBillData(); // Load data when component initializes
  }

  loadBillData(): void {
    // --- MOCK DATA ---
    // In a real app, fetch this data based on this.billId from a service
    this.billDetails = {
        id: this.billId ?? 0,
        tableName: 'Bàn 5 VIP',
        staffName: 'Nguyễn Văn A',
        createdAt: new Date(2024, 6, 20, 10, 30, 0), // Example date (Month is 0-indexed)
        totalAmount: 170000, // Example total (can be recalculated too)
        note: 'Ít cay, thêm rau thơm'
    };
    this.currentNote = this.billDetails?.note ?? ''; // Initialize note input

    this.billItems = [
      { id: 1, name: 'Phở Bò Tái Chín', quantity: 2, price: 50000 }, // Use raw numbers
      { id: 2, name: 'Nem Chua Rán', quantity: 1, price: 40000 },
      { id: 3, name: 'Trà Chanh', quantity: 3, price: 10000 },
    ];

    this.billLogs = [
      { id: 1, timestamp: new Date(2024, 6, 20, 10, 30, 5), action: 'Tạo hóa đơn', user: 'Nguyễn Văn A' },
      { id: 2, timestamp: new Date(2024, 6, 20, 10, 32, 15), action: 'Thêm món: Phở Bò Tái Chín (x2)', user: 'Nguyễn Văn A' },
      { id: 3, timestamp: new Date(2024, 6, 20, 10, 33, 0), action: 'Thêm món: Nem Chua Rán (x1)', user: 'Nguyễn Văn A' },
      { id: 4, timestamp: new Date(2024, 6, 20, 10, 35, 40), action: 'Thêm món: Trà Chanh (x3)', user: 'Nguyễn Văn A' },
      { id: 5, timestamp: new Date(2024, 6, 20, 10, 40, 10), action: 'Cập nhật ghi chú', user: 'Nguyễn Văn A' },
      { id: 6, timestamp: new Date(2024, 6, 20, 10, 55, 20), action: 'Yêu cầu thanh toán', user: 'Nguyễn Văn A' },
      { id: 7, timestamp: new Date(2024, 6, 20, 11, 0, 5), action: 'Xác nhận thanh toán', user: 'Thu Ngân B' },
      { id: 8, timestamp: new Date(2024, 6, 20, 11, 0, 10), action: 'Đóng hóa đơn', user: 'Thu Ngân B' },
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort logs newest first

    // --- END MOCK DATA ---

    this.updateDisplayedLogs(); // Initialize the displayed logs
  }

  // Calculate total price from items
  calculateTotalItemPrice(): number {
    return this.billItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
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
}