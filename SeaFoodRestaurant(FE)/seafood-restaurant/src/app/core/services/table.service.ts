import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TableRes } from '../../share/dto/response/table-response';

@Injectable({
    providedIn: 'root',
})
export class TableService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/table';

    constructor(
        private http: HttpClient
    ) {
    }

    getTables(): Observable<TableRes[]> {
        return this.http.get<TableRes[]>(`${this.apiUrl}`);
    }
}