import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DishRes } from '../../share/dto/response/dish-response';

@Injectable({
    providedIn: 'root',
})
export class DishService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/dish';

    constructor(
        private http: HttpClient
    ) {
    }

    getDishes(): Observable<DishRes[]> {
        return this.http.get<DishRes[]>(`${this.apiUrl}`);
    }

    getDishesByCatId(catId: number): Observable<DishRes[]> {
        return this.http.get<DishRes[]>(`${this.apiUrl}/category/${catId}`)
    }
}