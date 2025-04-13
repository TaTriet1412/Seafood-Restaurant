// src/app/views/pages/bills-shifts/bills-shifts.component.ts

import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, LOCALE_ID, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule, RowComponent, ButtonModule, FormModule, ColDirective, TableActiveDirective, TableColorDirective, AlignDirective, CardComponent, CardBodyComponent, CardHeaderComponent, ButtonDirective, FormSelectDirective, SpinnerModule } from '@coreui/angular';
import { ColComponent, DatePickerModule, IColumn, IItem, SmartPaginationModule, TemplateIdDirective, SmartTableModule, IColumnFilterValue, ISorterValue, AlertModule } from '@coreui/angular-pro';
import { NavAdminService } from '../../../../../core/services/nav-routing/nav-admin.service'; // Adjust path
import { OrderSessionRes } from '../../../../../share/dto/response/order_session-response'; // Adjust path
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, retry, switchMap, takeUntil, tap, startWith } from 'rxjs/operators';
import { OrderSessionService, IOrderSessionShiftApiParams, SpringPage } from '../../../../../core/services/order-session.service'; // Adjust path
import { HttpErrorResponse } from '@angular/common/http';

registerLocaleData(localeVi);

// Interface for Smart Table properties derived from RxJS subjects
export interface IShiftParams {
    activePage?: number; // Still 1-based for c-smart-pagination
    // columnFilterValue?: IColumnFilterValue; // Not used for primary filtering here
    itemsPerPage?: number; // Matches 'size'
    loadingData?: boolean;
    sorterValue?: ISorterValue; // { column, state: 'asc'|'desc' }
    totalPages?: number; // Derived from SpringPage response
    selectedDate: Date | null; // Keep track of the selected date
    selectedShift: string; // Keep track of the selected shift
}

@Component({
    selector: 'app-bills-shifts',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        RowComponent,
        ColComponent,
        DatePickerModule,
        ButtonModule,
        FormModule,
        SmartTableModule,
        // Removed ColDirective as it is not used
        SpinnerModule,
        TemplateIdDirective,
        TableActiveDirective,
        TableColorDirective,
        AlignDirective,
        CardComponent,
        CardBodyComponent,
        CardHeaderComponent,
        ButtonDirective,
        FormSelectDirective, // Import FormSelectDirective
        SmartPaginationModule,
        AlertModule
    ],
    providers: [
        DatePipe,
        { provide: LOCALE_ID, useValue: 'vi-VN' }
    ],
    templateUrl: './bills-shifts.component.html',
    styleUrls: ['./bills-shifts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsShiftsComponent implements OnInit, OnDestroy {

    private orderSessionService = inject(OrderSessionService);
    private navAdminService = inject(NavAdminService);
    private cdf = inject(ChangeDetectorRef);
    private datePipe = inject(DatePipe);

    // --- Filter State ---
    // Use BehaviorSubject for date and shift to trigger API calls reactively
    readonly selectedDate$ = new BehaviorSubject<Date | null>(new Date()); // Default to today
    readonly selectedShift$ = new BehaviorSubject<string>(''); // '' means 'All Shifts'

    // --- RxJS State Management for Smart Table ---
    readonly activePage$ = new BehaviorSubject(1); // UI uses 1-based pages
    readonly itemsPerPage$ = new BehaviorSubject(10); // Default size 10
    readonly loadingData$ = new BehaviorSubject<boolean>(true);
    readonly totalPages$ = new BehaviorSubject<number>(1);
    readonly sorterValue$ = new BehaviorSubject<ISorterValue>({ column: 'createdAt', state: 'desc' }); // Default sort

    // API parameters subject - Drives data fetching using IOrderSessionShiftApiParams
    // This will be updated whenever date, shift, page, size, or sort changes
    readonly apiParams$: Observable<IOrderSessionShiftApiParams>;

    readonly errorMessage$ = new Subject<string>();
    readonly #destroy$ = new Subject<boolean>();

    // Observable combining state for the template props
    readonly props$: Observable<IShiftParams>;

    // Observable for the actual order session data
    orderSessionsData$: Observable<OrderSessionRes[]>;

    // --- Smart Table Column Configuration ---
    // IMPORTANT: Ensure 'key' matches the field names in your Spring BillRes DTO
    readonly columns: (IColumn | string)[] = [
        { key: 'id', label: 'Mã HĐ', _style: { width: '8%' } },
        { key: 'status', label: 'Trạng thái', _style: { width: '10%' }, _props: { class: 'fw-bold' } },
        { key: 'totalPrice', label: 'Tổng tiền', _style: { width: '15%' } },
        { key: 'paymentTime', label: 'Tg thanh toán', _style: { width: '20%' } },
        { key: 'createdAt', label: 'Ngày tạo', _style: { width: '20%' } }, // Filtered by this
        // Optional: Add tableName, staffName if they are in BillRes
        // { key: 'tableName', label: 'Bàn', _style: { width: '10%' } },
        // { key: 'staffName', label: 'Nhân viên', _style: { width: '15%' } },
        { key: 'detail', label: 'Chi tiết', _style: { width: '10%', textAlign: 'center' }, filter: false, sorter: false }
    ];

    // --- NgModel bindings ---
    // Bind directly to BehaviorSubject's value for initial state, but use methods to update the Subjects
    selectedValue: Date | null = this.selectedDate$.value;
    selectedShift: string = this.selectedShift$.value;

    constructor() {
        // Combine all state sources that should trigger an API parameter update
        this.apiParams$ = combineLatest([
            this.selectedDate$,
            this.selectedShift$,
            this.activePage$,
            this.itemsPerPage$,
            this.sorterValue$
        ]).pipe(
            // Map the combined values to the IOrderSessionShiftApiParams structure
            map(([date, shift, page, size, sorter]) => {
                // Crucial: Ensure date is formatted correctly and handle null case
                const formattedDate = date ? this.formatDateForApi(date) : this.formatDateForApi(new Date()); // Default to today if null initially

                // Build the params object for the service call
                const params: IOrderSessionShiftApiParams = {
                    date: formattedDate,
                    page: page, // 1-based page
                    size: size,
                    sort: this.formatSortParam(sorter) || 'createdAt,desc', // Default sort
                    shift: shift || undefined // Send undefined if shift is empty string
                };
                return params;
            }),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // Prevent identical consecutive emissions
            takeUntil(this.#destroy$)
        );

        // Combine state for template props
        this.props$ = combineLatest([
            this.activePage$,
            this.itemsPerPage$,
            this.loadingData$,
            this.sorterValue$,
            this.totalPages$,
            this.selectedDate$, // Include date and shift for potential template logic
            this.selectedShift$
        ]).pipe(
            map(([activePage, itemsPerPage, loadingData, sorterValue, totalPages, selectedDate, selectedShift]) => ({
                activePage,
                itemsPerPage,
                loadingData,
                sorterValue,
                totalPages,
                selectedDate,
                selectedShift
            }))
        );

         // Data fetching pipeline driven by apiParams$
        this.orderSessionsData$ = this.apiParams$.pipe(
            // Optional debounce if needed (e.g., if date picker emitted rapidly)
            // debounceTime(100),
            tap(() => {
                this.loadingData$.next(true);
                this.errorMessage$.next(''); // Clear previous errors on new request
            }),
            switchMap(params => {
                 // Check if the date is valid before calling the API
                 if (!params.date) {
                    console.warn("API call skipped: Date is not selected.");
                    this.loadingData$.next(false);
                    this.totalPages$.next(0); // Reset pagination
                    this.errorMessage$.next('Vui lòng chọn ngày hợp lệ.');
                    return new BehaviorSubject<OrderSessionRes[]>([]).asObservable(); // Return empty data
                 }

                 return this.orderSessionService.getOrderSessionsByShift(params).pipe(
                    tap((response: SpringPage<OrderSessionRes>) => {
                        const totalPages = response.totalPages ?? 0;
                        this.totalPages$.next(totalPages);

                        // Handle page correction if current page > totalPages
                        const currentPageFromSpring = response.number + 1; // 1-based
                        if (this.activePage$.value > totalPages && totalPages > 0) {
                            this.setActivePage(totalPages); // Go to last valid page (will trigger new API call)
                        } else if (this.activePage$.value !== currentPageFromSpring && response.numberOfElements > 0 && totalPages > 0) {
                             // Optional: Sync component page if backend corrected it
                             // Be cautious as this might cause extra triggers if not handled carefully
                             // this.activePage$.next(currentPageFromSpring);
                        }

                        this.loadingData$.next(false);
                        this.cdf.markForCheck(); // Ensure view updates
                    }),
                    map(response => response.content ?? []) // Extract data array
                 );
                }
            ),
            // Ensure the initial value is processed even if apiParams$ doesn't change immediately
             startWith([]),
            takeUntil(this.#destroy$) // Auto-unsubscribe on component destruction
        );
    }

    ngOnInit(): void {
        // Initialization is mostly handled by BehaviorSubject defaults and combineLatest
        console.log("BillsShiftsComponent initialized.");
        // Trigger initial data load by ensuring apiParams$ emits
        // This happens automatically because BehaviorSubjects emit their current value on subscription
    }

    ngOnDestroy(): void {
        this.#destroy$.next(true);
        this.#destroy$.complete();
    }

    // --- Event Handlers ---

    onDateChange(date: Date | null): void {
        console.log('Date changed:', date);
        // Update the BehaviorSubject, which triggers apiParams$ update
        if (this.isValidDate(date)) {
            this.selectedValue = date; // Update ngModel binding value
            this.selectedDate$.next(date);
            this.setActivePage(1); // Reset to first page when date changes
        } else {
            // Handle invalid date selection if necessary (e.g., clear results)
             this.selectedValue = null;
             this.selectedDate$.next(null); // Or keep previous valid date? Decide behavior.
             this.errorMessage$.next('Ngày không hợp lệ.');
             console.warn('Invalid date selected');
             // Optionally clear data:
             // this.totalPages$.next(0);
             // this.loadingData$.next(false);
        }
    }

    onShiftSelectChange(shiftValue: string): void {
        console.log('Shift changed:', shiftValue);
        // Update the BehaviorSubject, triggering apiParams$ update
        this.selectedShift = shiftValue; // Update ngModel binding value
        this.selectedShift$.next(shiftValue);
        this.setActivePage(1); // Reset to first page when shift changes
    }

    handleActivePageChange(page: number): void {
        this.setActivePage(page);
    }

    // Sets the component's active page (1-based) and triggers API update
    setActivePage(page: number): void {
        const currentPage = this.activePage$.value;
        const totalPages = this.totalPages$.value;
        let targetPage = Math.max(1, page); // Ensure page >= 1
        if (totalPages > 0) {
            targetPage = Math.min(targetPage, totalPages); // Ensure page <= totalPages
        }

        if (targetPage !== currentPage) {
            this.activePage$.next(targetPage); // Update BehaviorSubject
        } else if (totalPages === 0 && currentPage !== 1) {
            // If totalPages is 0 (no results), force page back to 1
            this.activePage$.next(1);
        }
    }

    handleItemsPerPageChange(size: number): void {
        if (size !== this.itemsPerPage$.value) {
            this.itemsPerPage$.next(size); // Update BehaviorSubject
            this.setActivePage(1); // Reset page to 1
        }
    }

    handleSorterValueChange(sorterValue: ISorterValue): void {
        const newSort = this.formatSortParam(sorterValue);
        const currentSort = this.formatSortParam(this.sorterValue$.value);

        if (newSort !== currentSort) {
            this.sorterValue$.next(sorterValue ?? { column: 'createdAt', state: 'desc' }); // Update BehaviorSubject
            this.setActivePage(1); // Reset page to 1
        }
    }

     // Optional: Handle built-in table filters if you add them
    // handleColumnFilterValueChange(filters: IColumnFilterValue): void {
    //   // Implement if using smart table's column filters for secondary filtering
    //   console.log('Column filters changed:', filters);
    //   // This might require adding more params to your API or doing client-side filtering
    // }

    // --- Utility / Formatting ---

    // Formats ISorterValue to "column,direction" string or undefined
    private formatSortParam(sorter: ISorterValue | undefined): string | undefined {
        if (!sorter || !sorter.column || !sorter.state) {
            return undefined; // Backend should use default
        }
        return `${sorter.column},${sorter.state}`;
    }

    // Formats Date object to 'yyyy-MM-dd' string for the API
    private formatDateForApi(date: Date | null): string {
        if (!date) {
             console.warn("formatDateForApi received null, returning today's date.");
             date = new Date(); // Default to today or handle as error
        }
        // Use DatePipe for reliable formatting respecting locale might not be needed here
        // but ensure month/day have leading zeros
        // return this.datePipe.transform(date, 'yyyy-MM-dd') ?? ''; // Handle potential null from transform

        // Manual formatting (ensure robustness)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth is 0-based
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

     // Basic check if the date object is valid
    private isValidDate(d: any): d is Date {
        return d instanceof Date && !isNaN(d.getTime());
    }

    // --- Action ---
    goToBillDetail(item: IItem): void {
        const billId = item['id']; // Access ID directly
        if (billId) {
            this.navAdminService.goToBillDetail(billId.toString());
        } else {
            console.error("Bill ID not found in item:", item);
            this.errorMessage$.next("Không thể xem chi tiết: Thiếu mã hóa đơn.");
        }
    }

     // Translate status if needed (same as BillsDateComponent)
     translateStatusBill(status: string): string {
      switch (status) {
        case 'Completed':
          return 'Hoàn thành';
        case 'Ready To Pay':
          return 'Sẵn sàng thanh toán';
        case 'Ordered':
          return 'Đã đặt hàng';
        default:
          return 'Lỗi';
      }
    }
}