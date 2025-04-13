import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs';
import { OrderDetailChefRes } from '../../share/dto/response/order_detail_chef';

@Injectable({
    providedIn: 'root',
})
export class OrderDetailService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/order-detail';

    constructor(
        private http: HttpClient
    ) {
    }

    updateOrderDetail(id: number): Observable<OrderDetailChefRes> {
        return this.http.put<OrderDetailChefRes>(`${this.apiUrl}/finished`, id);
    }
}