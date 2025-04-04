import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DishService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/table';

    constructor(
        private http: HttpClient
    ) {
    }

    getTables(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }
}