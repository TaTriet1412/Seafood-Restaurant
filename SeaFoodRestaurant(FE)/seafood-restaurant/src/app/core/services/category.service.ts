import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CategoryRes } from '../../share/dto/response/category-response';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/category';

    constructor(
        private http: HttpClient
    ) {
    }

    getCategories(): Observable<CategoryRes[]> {
        return this.http.get<CategoryRes[]>(`${this.apiUrl}`);
    }
}