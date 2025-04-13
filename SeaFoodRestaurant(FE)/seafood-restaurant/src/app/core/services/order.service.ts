import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs';
import { Order } from '../../share/dto/response/order';
import { CreateOrder } from '../../share/dto/request/create-order';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/order';

    constructor(
        private http: HttpClient
    ) {
    }

    handleNewOrder(createOrderReq: CreateOrder): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}`, createOrderReq);
    }
}