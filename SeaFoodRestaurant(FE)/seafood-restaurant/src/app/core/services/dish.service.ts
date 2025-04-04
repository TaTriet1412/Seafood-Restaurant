import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DishService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/dish';

    constructor(
        private http: HttpClient
    ) {
    }

    getDishes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }
}