import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    private apiUrl = 'http://localhost:8080/seafood_restaurant/images';
    auth_Token = '';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) {
        this.auth_Token = authService.getToken();
    }

    getImage(images_url: string): Observable<string> {
        return new Observable<string>(observer => {
          this.http.get(`${this.apiUrl}?path=${images_url}`, {
            responseType: 'blob',
            headers: {
              'Authorization': `Bearer ${this.auth_Token}`
            }
          }).subscribe({
            next: (blob) => {
              const objectUrl = URL.createObjectURL(blob);
              observer.next(objectUrl);
              observer.complete();
            },
            error: (err) => {
              console.error('Error loading image:', err);
              observer.error(err);
            }
          });
        });
      }
      
}