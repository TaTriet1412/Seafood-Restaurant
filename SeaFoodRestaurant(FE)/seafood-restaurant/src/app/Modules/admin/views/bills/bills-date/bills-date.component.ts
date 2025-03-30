// bills-date.component.ts
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common'; // Import CommonModule for *ngIf, DatePipe etc.
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for [(ngModel)]
import { CardModule, RowComponent, ButtonModule, FormModule, ColDirective, TableActiveDirective, TableColorDirective, AlignDirective, CardComponent, CardBodyComponent, CardHeaderComponent, ButtonDirective } from '@coreui/angular'; // Added ButtonModule, FormModule for potential button/label usage
import { ColComponent, DatePickerModule, IColumn, IItem, SmartPaginationModule, TemplateIdDirective, SmartTableModule } from '@coreui/angular-pro'; // Ensure CoreUI Pro is correctly imported

// Register the Vietnamese locale data

@Component({
  selector: 'app-bills-date',
  standalone: true,
  imports: [
    CommonModule,     // Provides *ngIf, async pipe, DatePipe etc.
    FormsModule,      // Provides [(ngModel)]
    CardModule,
    RowComponent,
    ColComponent,
    DatePickerModule, // CoreUI Pro Date Picker
    ButtonModule,     // If using cButton
    FormModule,        // If using cLabel, form-select etc. within CoreUI context
    SmartTableModule,
    ColDirective,
    TemplateIdDirective,
    TableActiveDirective,
    TableColorDirective,
    AlignDirective,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    SmartPaginationModule,
  ],
  providers: [
    DatePipe, // Provide DatePipe if not provided globally
    { provide: LOCALE_ID, useValue: 'vi-VN' } // Set default locale for the component
  ],
  templateUrl: './bills-date.component.html',
  styleUrls: ['./bills-date.component.scss'], // Use styleUrls (plural)
  // changeDetection: ChangeDetectionStrategy.OnPush, // Optional: Use OnPush for potential performance improvement if inputs don't change frequently
})
export class BillsDateComponent implements OnInit {

  // Determines the selection mode of the date picker ('year', 'month', 'day')
  selectedFilter: 'year' | 'month' | 'day' = 'year'; // Default selection type is YEAR

  // Stores the Date object selected by the picker
  selectedValue: Date | null = null; // Initialize to null

  loadingData = true; // Controls the loading state for the table
  dateFormat: string = 'yyyy'; // Initialize date format for year

  // Store the original full dataset
  private originalBillsData: IItem[] = [];
  // Store the currently displayed/filtered dataset
  filteredBillsData: IItem[] = [];

  columns: (IColumn | string)[] = [
    {
      key: 'id',
      label: 'Mã HĐ', // Shorter label
      _style: { width: '8%' },
    },
    {
      key: 'table_name',
      label: 'Bàn',
      _style: { width: '10%' },
      _props: { class: 'fw-bold' }
    },
    {
      key: 'total',
      label: 'Tổng tiền',
      _style: { width: '15%' },
    },
    {
      key: 'staff',
      label: 'Nhân viên',
      _style: { width: '20%' },
    },
    {
      key: 'created_at', // Add the date column
      label: 'Ngày tạo',
      _style: { width: '20%' }
    },
    {
      key: 'detail',
      label: 'Chi tiết', // More descriptive label
      _style: { width: '10%', textAlign: 'center' }, // Center align button
      filter: false,
      sorter: false
    }
  ];


  constructor(
    private cdf: ChangeDetectorRef,
    private datePipe: DatePipe // Inject DatePipe
  ) { }

  ngOnInit(): void {
    this.initializeFilter();
    this.loadDataBills(); // Load initial data
  }

  initializeFilter(): void {
    this.selectedFilter = 'year'; // Ensure default is year
    this.selectedValue = new Date(); // Set default value to today (date picker will handle showing year)
    this.updateDateFormat(); // Update format based on initial filter
  }

  loadDataBills(): void {
    this.loadingData = true;
    // Simulate API call delay
    setTimeout(() => {
      // --- Sample Data with Dates ---
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);

      this.originalBillsData = [
        {
          id: 1,
          table_name: 'Bàn 1',
          total: 1000000, // Use number for sorting/filtering
          staff: 'Nguyễn Thành Long',
          created_at: today // Date object
        },
        {
          id: 2,
          table_name: 'Bàn 2',
          total: 150000,
          staff: 'Tạ Triết',
          created_at: yesterday // Yesterday
        },
        {
          id: 3,
          table_name: 'Bàn VIP 1',
          total: 2500000,
          staff: 'Nguyễn Thành Long',
          created_at: lastMonth // Last month same day
        },
        {
          id: 4,
          table_name: 'Bàn 5',
          total: 550000,
          staff: 'Lê Thị Hoa',
          created_at: lastYear // Last year same day
        },
         {
          id: 5,
          table_name: 'Bàn 3',
          total: 800000,
          staff: 'Tạ Triết',
          created_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) // Two days ago
        },
         {
          id: 6,
          table_name: 'Bàn 6',
          total: 120000,
          staff: 'Lê Thị Hoa',
          created_at: new Date(today.getFullYear() -1 , today.getMonth() +1 , 15) // Last year, next month, 15th
        },
      ];
      // --- End Sample Data ---

      this.applyFilter(); // Apply the initial filter (current year)
      this.loadingData = false;
      this.cdf.markForCheck(); // Trigger change detection if using OnPush
    }, 500); // Simulate 0.5 second loading
  }

  // Dynamically generates the label and updates date format based on the selected filter type
  get filterLabel(): string {
    switch (this.selectedFilter) {
      case 'year': return 'Năm';
      case 'month': return 'Tháng';
      case 'day': return 'Ngày';
      default: return 'Giá trị'; // Fallback
    }
  }

  // Update date picker format when filter type changes
  updateDateFormat(): void {
     switch (this.selectedFilter) {
      case 'year':
        this.dateFormat = 'yyyy'; // CoreUI uses 'yyyy' for year
        break;
      case 'month':
        this.dateFormat = 'MM/yyyy';
        break;
      case 'day':
        this.dateFormat = 'dd/MM/yyyy';
        break;
    }
    this.cdf.markForCheck(); // Update view if needed
  }

  // Called when the filter type dropdown changes
  onFilterTypeChange(): void {
      this.updateDateFormat();
      // Optionally reset the selected date when type changes,
      // or keep it and let the filter logic adapt? Let's reset for clarity.
      this.selectedValue = null; // Reset date value
      this.applyFilter(); // Re-apply filter (will likely show all data now)
      console.log("Filter type changed to:", this.selectedFilter);
  }


  // Called when the date picker value is committed
  onDateChange(event: Date | null): void {
    console.log(`Filter type: ${this.selectedFilter}, Date changed event:`, event);
    // ngModel updates selectedValue automatically
    // this.selectedValue = event; // No need for this line if using [(ngModel)]

    // Trigger the actual filtering logic
    this.applyFilter();
  }

  // Reset filters and show all data
  resetValue(): void {
    this.selectedFilter = 'year'; // Reset to default type
    this.selectedValue = null;    // Clear selected date
    this.updateDateFormat();      // Update format for 'year'
    this.applyFilter();           // Apply filter (shows all)
    console.log('Filters reset');
    this.cdf.markForCheck();      // Update view
  }

  // Applies the filter to the original data based on current selections
  applyFilter(): void {
    this.loadingData = true; // Show loading indicator
    this.cdf.markForCheck(); // Reflect loading state change

    // Use setTimeout to allow the loading indicator to render before filtering starts
    setTimeout(() => {
      if (!this.selectedValue) {
        // If no date is selected, show all original data
        this.filteredBillsData = [...this.originalBillsData]; // Create a copy
      } else {
        const selectedDate = this.selectedValue; // It's a Date object
        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
        const selectedDay = selectedDate.getDate();

        console.log(`Applying filter - Type: ${this.selectedFilter}, Year: ${selectedYear}, Month: ${selectedMonth}, Day: ${selectedDay}`);

        this.filteredBillsData = this.originalBillsData.filter(item => {
          // Ensure item.created_at is a valid Date object before proceeding
          if (!(item['created_at'] instanceof Date) || isNaN(item['created_at'].getTime())) {
              console.warn(`Invalid date found for item id: ${item['id']}`);
              return false; // Skip items with invalid dates
          }

          const itemDate = item['created_at'] as Date; // Cast to Date
          const itemYear = itemDate.getFullYear();
          const itemMonth = itemDate.getMonth();
          const itemDay = itemDate.getDate();

          switch (this.selectedFilter) {
            case 'year':
              return itemYear === selectedYear;
            case 'month':
              // Match year AND month
              return itemYear === selectedYear && itemMonth === selectedMonth;
            case 'day':
              // Match year, month, AND day
              return itemYear === selectedYear && itemMonth === selectedMonth && itemDay === selectedDay;
            default:
              return true; // Should not happen with current setup, but good fallback
          }
        });
      }

      console.log(`Filtering complete. ${this.filteredBillsData.length} items found.`);
      this.loadingData = false; // Hide loading indicator
      this.cdf.markForCheck(); // Trigger change detection to update the table
    }, 10); // Small delay (10ms) for UI update
  }

  // Placeholder for viewing bill details
  viewDetail(item: IItem): void {
      console.log("View details for:", item);
      // Implement navigation or modal display logic here
      alert(`Xem chi tiết cho Hóa đơn ID: ${item['id']}\nBàn: ${item['table_name']}\nTổng tiền: ${item['total']}\nNgày: ${this.datePipe.transform(item['created_at'], 'dd/MM/yyyy HH:mm')}`);
  }
}