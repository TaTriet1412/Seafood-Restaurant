// src/app/views/pages/bills-date/bills-date.component.ts

import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, LOCALE_ID, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule, RowComponent, ButtonModule, FormModule, ColDirective, TableActiveDirective, TableColorDirective, AlignDirective, CardComponent, CardBodyComponent, CardHeaderComponent, ButtonDirective } from '@coreui/angular';
import { ColComponent, DatePickerModule, IColumn, IItem, SmartPaginationModule, TemplateIdDirective, SmartTableModule, IColumnFilterValue, ISorterValue, AlertModule } from '@coreui/angular-pro';
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service';
// Ensure this DTO matches the fields returned by Spring (id, status, createdAt, tableName, total, staffName)
import { OrderSessionRes } from '../../../../../share/dto/response/order_session-response';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, retry, switchMap, takeUntil, tap } from 'rxjs/operators';
// Import the updated service and interfaces
import { OrderSessionService, IOrderSessionApiParams, SpringPage } from '../../../../../core/services/order-session.service';
import { HttpErrorResponse } from '@angular/common/http';

registerLocaleData(localeVi);

// Interface for Smart Table properties derived from RxJS subjects (remains the same)
export interface IParams {
  activePage?: number; // Still 1-based for c-smart-pagination
  columnFilterValue?: IColumnFilterValue; // Keep for potential future use (maps to keyword)
  itemsPerPage?: number; // Matches 'size'
  loadingData?: boolean;
  sorterValue?: ISorterValue; // { column, state: 'asc'|'desc' }
  totalPages?: number; // Derived from SpringPage response
}

@Component({
  selector: 'app-bills-date',
  standalone: true,
  imports: [ CommonModule,     // Provides *ngIf, async pipe, DatePipe etc.
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
    AlertModule ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  templateUrl: './bills-date.component.html',
  styleUrls: ['./bills-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsDateComponent implements OnInit, OnDestroy {

  private orderSessionService = inject(OrderSessionService);
  private navAdminService = inject(NavAdminService);
  private cdf = inject(ChangeDetectorRef);

  // --- Date Picker State ---
  selectedFilter: 'year' | 'month' | 'day' = 'year';
  selectedValue: Date | null = null;
  dateFormat: string = 'yyyy';

  // --- RxJS State Management for Smart Table ---
  readonly activePage$ = new BehaviorSubject(1); // Component/UI uses 1-based pages
  readonly itemsPerPage$ = new BehaviorSubject(5); // Corresponds to Spring 'size'
  readonly loadingData$ = new BehaviorSubject<boolean>(true);
  readonly totalPages$ = new BehaviorSubject<number>(1); // Will be updated from API response
  readonly sorterValue$ = new BehaviorSubject<ISorterValue>({}); // { column, state }
  readonly columnFilterValue$ = new BehaviorSubject<IColumnFilterValue>({}); // Use for keyword if needed

  // API parameters subject - This drives the data fetching using the correct param names
  readonly apiParams$ = new BehaviorSubject<IOrderSessionApiParams>({
    page: this.activePage$.value, // Start with 1-based page
    size: this.itemsPerPage$.value,
    sort: 'createdAt,desc', // Initial sort matching Spring default
  });

  readonly errorMessage$ = new Subject<string>();
  readonly retry$ = new Subject<boolean>();

  // Observable combining state for the template props (remains mostly the same)
  readonly props$: Observable<IParams> = combineLatest([
    this.activePage$,
    this.columnFilterValue$,
    this.itemsPerPage$,
    this.loadingData$,
    this.sorterValue$,
    this.totalPages$
  ]).pipe(
    map(([activePage, columnFilterValue, itemsPerPage, loadingData, sorterValue, totalPages]) => ({
      activePage, // Keep 1-based for pagination component
      columnFilterValue,
      itemsPerPage,
      loadingData,
      sorterValue,
      totalPages
    }))
  );

  // Observable for the actual order session data (type is OrderSessionRes[])
  orderSessionsData$!: Observable<OrderSessionRes[]>;

  readonly #destroy$ = new Subject<boolean>();

  // --- Smart Table Column Configuration ---
  // IMPORTANT: Ensure 'key' matches the field names in your *Spring* OrderSessionRes DTO
  readonly columns: (IColumn | string)[] = [
      { key: 'id', label: 'Mã HĐ', _style: { width: '8%' } },
      // Assuming your Spring OrderSessionRes has 'tableName' field mapped from OrderSession -> Table -> name
      { key: 'status', label: 'Trạng thái', _style: { width: '10%' }, _props: { class: 'fw-bold' } },
      // Assuming your Spring OrderSessionRes has 'total' field calculated/mapped
      { key: 'totalPrice', label: 'Tổng tiền', _style: { width: '15%' } },
      // Assuming your Spring OrderSessionRes has 'staffName' field mapped from OrderSession -> Staff -> name
      { key: 'paymentTime', label: 'Tg thanh toán', _style: { width: '20%' } },
      // Matches 'createdAt' field in Spring DTO (Ensure type compatibility: LocalDateTime/Instant -> DatePipe)
      { key: 'createdAt', label: 'Ngày tạo', _style: { width: '20%' } },
      { key: 'detail', label: 'Chi tiết', _style: { width: '10%', textAlign: 'center' }, filter: false, sorter: false }
  ];

  ngOnInit(): void {
    this.initializeFilter();
    this.setupDataFetchingPipeline();
    this.setupApiParamsUpdates();
    // Optional: Add keyword listener if needed
    // this.setupKeywordListener();
  }

  ngOnDestroy(): void {
    this.#destroy$.next(true);
    this.#destroy$.complete();
  }

  initializeFilter(): void {
    this.selectedFilter = 'year';
    this.selectedValue = new Date();
    this.updateDateFormat();
    // Update initial apiParams with default date filter based on today's year
    this.updateApiParamsForDate();
  }

  setupDataFetchingPipeline(): void {
    this.orderSessionsData$ = this.apiParams$.pipe(
      // debounceTime(100), // Debounce if needed, e.g., for keyword typing
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(() => this.loadingData$.next(true)),
      switchMap(params =>
        this.orderSessionService.getOrderSessionWithPagination(params).pipe( // Call the updated service method
          catchError((error: Error) => { // Catch the error from the service
            console.error('Pipeline Error:', error);
            this.errorMessage$.next(`Không thể tải dữ liệu: ${error.message}`);
            this.loadingData$.next(false);
            return throwError(() => error); // Re-throw
          }),
          tap((response: SpringPage<OrderSessionRes>) => { // Process the SpringPage response
            const totalItems = response.totalElements ?? 0;
            const totalPages = response.totalPages ?? 1;
            this.totalPages$.next(totalPages); // Update total pages state

             // Handle cases where the current page might become invalid after filtering
             const currentPageFromSpring = response.number + 1; // Convert Spring's 0-based to 1-based
             if (this.activePage$.value > totalPages && totalPages > 0) {
                 this.setActivePage(totalPages); // Go to last valid page
             } else if (this.activePage$.value !== currentPageFromSpring && response.numberOfElements > 0) {
                 // Optional: Sync component page if backend corrected it (e.g., page > totalPages)
                 // this.activePage$.next(currentPageFromSpring);
             }

            this.errorMessage$.next(''); // Clear error on success
            this.loadingData$.next(false);
            this.cdf.markForCheck();
          }),
          map(response => response.content ?? []), // Extract the data array (content)
        )
      ),
      takeUntil(this.#destroy$)
    );
  }

  setupApiParamsUpdates(): void {
    // Update page/size in apiParams$ when component state changes
    combineLatest([this.activePage$, this.itemsPerPage$]).pipe(
      map(([page, size]) => ({ page, size })), // Create object with correct keys
      distinctUntilChanged((prev, curr) => prev.page === curr.page && prev.size === curr.size),
      takeUntil(this.#destroy$)
    ).subscribe(({ page, size }) => {
      this.updateApiParams({ page, size });
    });

    // Update sort in apiParams$ when sorterValue$ changes
    this.sorterValue$.pipe(
      map(sorter => this.formatSortParam(sorter)), // Format to "column,direction"
      distinctUntilChanged(),
      takeUntil(this.#destroy$)
    ).subscribe(sort => {
      this.updateApiParams({ sort: sort || 'createdAt,desc' }); // Ensure default sort if sorter is reset
    });

    // If using columnFilterValue for the main keyword search
    // this.columnFilterValue$.pipe(
    //   map(filters => filters['keyword'] as string || ''), // Extract keyword if using generic filter input
    //   debounceTime(300), // Wait for user to stop typing
    //   distinctUntilChanged(),
    //   takeUntil(this.#destroy$)
    // ).subscribe(keyword => {
    //   this.updateApiParams({ keyword: keyword || undefined, page: 1 }); // Reset to page 1 on keyword change
    //   this.activePage$.next(1); // Also update the component state page
    // });
  }

  // Helper to update apiParams$ state
  private updateApiParams(newParams: Partial<IOrderSessionApiParams>): void {
    const currentParams = this.apiParams$.value;
    const updatedParams: IOrderSessionApiParams = { ...currentParams, ...newParams };

    // Clean up undefined/null params *before* emitting
    Object.keys(updatedParams).forEach(key => {
        const k = key as keyof IOrderSessionApiParams;
        if (updatedParams[k] === undefined || updatedParams[k] === null) {
             // Keep 0 for page number if it becomes 0 during conversion
             if (k !== 'page' || updatedParams[k] !== 0) {
                delete updatedParams[k];
             }
        }
    });


    this.apiParams$.next(updatedParams);
  }

  // --- Date Picker Logic ---
  updateDateFormat(): void {
    switch (this.selectedFilter) {
      case 'year':
        this.dateFormat = 'yyyy';
        break;
      case 'month':
        this.dateFormat = 'MM/yyyy';
        break;
      case 'day':
        this.dateFormat = 'dd/MM/yyyy';
        break;
      default:
        this.dateFormat = 'yyyy';
    }
  }

  onFilterTypeChange(): void {
    this.updateDateFormat();
    this.updateApiParamsForDate(); // Update date params in apiParams$
    this.setActivePage(1); // Reset to first page
  }

  onDateChange(date: Date | null): void {
    this.selectedValue = date;
    this.updateApiParamsForDate(); // Update date params in apiParams$
    this.setActivePage(1); // Reset to first page
  }

  // Updates year, month, day in apiParams based on selectedValue and selectedFilter
  private updateApiParamsForDate(): void {
    let dateParams: Partial<IOrderSessionApiParams> = {
      year: undefined,
      month: undefined,
      day: undefined
    };
    if (this.selectedValue) {
      const d = this.selectedValue;
      dateParams.year = d.getFullYear();
      if (this.selectedFilter === 'month' || this.selectedFilter === 'day') {
        dateParams.month = d.getMonth() + 1; // Send 1-12 to backend
      }
      if (this.selectedFilter === 'day') {
        dateParams.day = d.getDate();
      }
    }
    // Only update these specific params
    this.updateApiParams(dateParams);
  }

  // --- Smart Table Event Handlers ---
  handleActivePageChange(page: number): void {
    this.setActivePage(page); // Update component state (activePage$)
  }

  // Sets the component's active page (1-based)
  setActivePage(page: number): void {
    const currentPage = this.activePage$.value;
    const totalPages = this.totalPages$.value;
    page = Math.max(1, page);
    if (totalPages > 0) {
        page = Math.min(page, totalPages);
    }
    if (page !== currentPage) {
        this.activePage$.next(page); // This triggers the apiParams update via combineLatest
    }
  }

  handleItemsPerPageChange(size: number): void {
    if (size !== this.itemsPerPage$.value) {
      this.itemsPerPage$.next(size); // This triggers the apiParams update
      // Typically reset to page 1 when size changes
      this.setActivePage(1);
    }
  }

  handleSorterValueChange(sorterValue: ISorterValue): void {
    const newSort = this.formatSortParam(sorterValue);
    const currentSort = this.formatSortParam(this.sorterValue$.value);

    if (newSort !== currentSort){
        this.sorterValue$.next(sorterValue ?? {}); // This triggers the apiParams update
        // Reset to page 1 when sorting changes
        this.setActivePage(1);
    }
  }

  // Optional: If using c-smart-table's built-in filter inputs mapped to 'keyword'
  handleColumnFilterValueChange(columnFilterValue: IColumnFilterValue): void {
    // Example: Assuming a filter input with key 'keyword' exists in the table header
    const keyword = columnFilterValue['keyword'] as string | undefined;
    const currentKeyword = this.apiParams$.value.keyword;

    if(keyword !== currentKeyword) {
      this.columnFilterValue$.next(columnFilterValue ?? {}); // Update state if needed
      this.updateApiParams({ keyword: keyword || undefined }); // Update apiParams directly
      this.setActivePage(1);
    }
  }

  // --- Utility / Formatting ---
  // Formats ISorterValue to "column,direction" string or undefined
  private formatSortParam(sorter: ISorterValue | undefined): string | undefined {
    if (!sorter || !sorter.column || !sorter.state) {
      return undefined; // Let backend use default or send explicit default
    }
    return `${sorter.column},${sorter.state}`;
  }

  // --- Action ---
  goToBillDetail(item: IItem): void {
    // Cast item to the correct type if needed, then access id
    const bill = item ;
    if (bill && bill['id']) {
      this.navAdminService.goToBillDetail(bill['id'].toString());
    } else {
      console.error("Bill ID not found in item:", item);
    }
  }

  get filterLabel(): string {
    switch (this.selectedFilter) {
      case 'year': return 'Năm';
      case 'month': return 'Tháng';
      case 'day': return 'Ngày';
      default: return 'Giá trị';
    }
  }

  translateStatusBill(status: string) {
    switch (status) {
      case "Ordered":
        return "Gửi yêu cầu cho bếp"
      case "In Progress":
        return "Đang nấu"
      case "Completed":
        return "Hoàn thành"
      default:
        return "Lỗi"
    }
  }

}