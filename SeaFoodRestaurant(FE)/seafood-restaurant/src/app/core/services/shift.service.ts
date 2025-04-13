import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable  } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShiftService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/secret-code';

    constructor(
        private http: HttpClient
    ) {
    }

    getCurrentCode(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/generate`);
    }

    validateSecretCode(secretCode: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/validate`, { secretCode });
    }
}