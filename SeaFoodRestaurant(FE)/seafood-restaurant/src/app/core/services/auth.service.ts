import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../share/dto/response/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private userRole: string = 'none';
  authStatusChanged: EventEmitter<string> = new EventEmitter();

  private apiUrl = 'http://localhost:8080/seafood_restaurant/auth';

  constructor(
    private http: HttpClient
  ) {
    this.loadAuthStatus();
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string {
    return localStorage.getItem('auth_token')!
  }

  login(userId: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/login", { userId, password }).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          this.saveToken(response.token); // Save token after successful login
          this.saveInfoUser(response.name, response.email)
          this.loadRole(response.role)
          this.saveAuthStatus();
          this.authStatusChanged.emit(this.userRole);
        }
      })
    );
  }

  loadRole(role: string) {
    this.userRole = role;
  }

  logout(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, { email }).pipe(
      tap(() => {
        localStorage.clear();
        this.resetDefaultUser();
      })
    );
  }

  resetDefaultUser() {
    this.userRole = 'none';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  getAuthStatus() {
    return this.userRole !== 'none';
  }

  getStaffStatus() {
    return this.userRole === 'Staff';
  }

  getChefStatus() {
    return this.userRole === 'Chef';
  }


  getAdminStatus() {
    return this.userRole === 'Manager';
  }

  getRole(): string {
    return this.userRole;
  }

  getEmail(): string {
    return localStorage.getItem('email')!;
  }

  private saveAuthStatus() {
    localStorage.setItem('userRole', this.userRole);
  }

  private saveInfoUser(name: string, email: string) {
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
  }

  private loadAuthStatus() {
    const savedUserRole = localStorage.getItem('userRole') as 'none' | 'staff' | 'admin' | 'chef';
    if (savedUserRole) {
      this.userRole = savedUserRole;
      this.authStatusChanged.emit(this.userRole);
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('userRole');
  }
}
