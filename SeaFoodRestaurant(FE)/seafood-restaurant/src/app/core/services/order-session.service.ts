import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../../share/dto/response/order';
import { OrderSessionRes } from '../../share/dto/response/order_session-response';
import { BillBaseRes } from '../../share/dto/response/bill-base-response';
import { OrderLogRes } from '../../share/dto/response/order-log-response';
import { OrderNote } from '../../share/dto/response/order-note.response';
import { BillBaseList } from '../../share/dto/response/bill-base-list-response';

export interface SpringPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;         // Items per page requested
    number: number;       // The current page number (0-indexed) from Spring
    numberOfElements: number; // Number of elements in the current page
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable?: { // Often included by Spring
        pageNumber: number;
        pageSize: number;
        sort: { sorted: boolean; unsorted: boolean; empty: boolean; };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    sort?: { sorted: boolean; unsorted: boolean; empty: boolean; };
}

// Base API Params Interface (Optional, but good practice)
export interface IBaseApiParams {
    page?: number;    // Component uses 1-based, Service converts to 0-based for Spring
    size?: number;
    sort?: string;    // e.g., "createdAt,desc"
}

export interface IOrderSessionShiftApiParams extends IBaseApiParams {
    date: string;     // yyyy-MM-dd format required by backend
    shift?: string;    // 'a' or 'b', optional
}

/**
 * Parameters expected by the Spring Boot GET /order-sessions/filter/time endpoint.
 */
export interface IOrderSessionApiParams {
    page?: number;           // Page number (NOTE: Angular usually uses 1-based, Spring uses 0-based)
    size?: number;           // Items per page (matches Spring 'size')
    sort?: string;           // Comma-separated "column,direction" (e.g., "createdAt,desc")
    keyword?: string;        // Optional search keyword
    year?: number;
    month?: number;          // Month (1-12)
    day?: number;
    // filterType is internal to Angular component, not sent to backend
}

@Injectable({
    providedIn: 'root',
})
export class OrderSessionService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/order-session';

    constructor(
        private http: HttpClient
    ) {
    }

    getOrdersByOrderSessionId(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}/details`);
    }

    getOrdersInProgressOrOrdered(): Observable<OrderSessionRes[]> {
        return this.http.get<OrderSessionRes[]>(`${this.apiUrl}/in-progress-or-ordered`);
    }

    updateAllOrderDetailsToCooking(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/order-details/cooking`, null);
    }

    // getOrderSessionWithPagination(params: any): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}`, { params });
    // }

    getBillBase(id: number): Observable<BillBaseRes> {
        return this.http.get<BillBaseRes>(`${this.apiUrl}/${id}/bill/base`)
    }

    getAllBillBaseList(): Observable<BillBaseList[]> {
        return this.http.get<BillBaseList[]>(`${this.apiUrl}/exits-in-table/bill`)
    }

    getListLogOfBill(id: number): Observable<OrderLogRes[]> {
        return this.http.get<OrderLogRes[]>(`${this.apiUrl}/${id}/logs`)
    }

    getOrderNotesByOrderSessionId(id: number): Observable<OrderNote[]> {
        return this.http.get<OrderNote[]>(`${this.apiUrl}/${id}/all-order`);
    }

    getOrderSessionWithPagination(params: IOrderSessionApiParams): Observable<SpringPage<OrderSessionRes>> {
        let httpParams = new HttpParams();

        // --- Map Angular Params to Spring Params ---

        // Page: Convert Angular's 1-based page to Spring's 0-based page
        const springPage = (params.page !== undefined && params.page > 0) ? params.page - 1 : 0;
        httpParams = httpParams.set('page', springPage.toString());

        // Size: Directly use 'size' if provided, otherwise Spring's default (5) will apply
        if (params.size !== undefined) {
            httpParams = httpParams.set('size', params.size.toString());
        }

        // Sort: Use the "column,direction" string directly. Add default if not provided.
        const sortParam = params.sort || 'createdAt,desc'; // Default sort if none provided by component
        httpParams = httpParams.set('sort', sortParam);

        // Keyword: Add if present
        if (params.keyword) {
            httpParams = httpParams.set('keyword', params.keyword);
        }

        // Date Filters: Add year, month, day if present
        if (params.year !== undefined) {
            httpParams = httpParams.set('year', params.year.toString());
        }
        if (params.month !== undefined) {
            httpParams = httpParams.set('month', params.month.toString());
        }
        if (params.day !== undefined) {
            httpParams = httpParams.set('day', params.day.toString());
        }

        console.log('[OrderSessionService] Sending Request Params:', httpParams.toString());

        // Expecting Spring's Page<OrderSessionRes> structure
        return this.http.get<SpringPage<OrderSessionRes>>(`${this.apiUrl}/filter/time`, { params: httpParams })
            .pipe(
                catchError(this.handleHttpError)
            );
    }

    getOrderSessionsByShift(params: IOrderSessionShiftApiParams): Observable<SpringPage<OrderSessionRes>> {
        let httpParams = new HttpParams();

        // Required date parameter (ensure it's yyyy-MM-dd)
        httpParams = httpParams.set('date', params.date);

        // Optional shift parameter
        if (params.shift) {
            httpParams = httpParams.set('shift', params.shift);
        }

        // Page: Convert Angular's 1-based page to Spring's 0-based page
        const springPage = (params.page !== undefined && params.page > 0) ? params.page - 1 : 0;
        httpParams = httpParams.set('page', springPage.toString());

        // Size: Use provided size or let Spring use its default
        if (params.size !== undefined) {
            httpParams = httpParams.set('size', params.size.toString());
        }

        // Sort: Use provided sort or default
        const sortParam = params.sort || 'createdAt,desc'; // Consistent default sort
        httpParams = httpParams.set('sort', sortParam);

        console.log('[OrderSessionService /filter/shift] Sending Request Params:', httpParams.toString());

        // Target the correct endpoint for shift filtering
        return this.http.get<SpringPage<OrderSessionRes>>(`${this.apiUrl}/filter/shift`, { params: httpParams })
            .pipe(
                catchError(this.handleHttpError) // Reuse the error handler
            );
    }


    private handleHttpError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        // Provide a more user-friendly error message
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}