import { Injectable, EventEmitter, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy{
  private userRole: 'none' | 'staff' | 'admin' | 'chef' = 'none';
  authStatusChanged: EventEmitter<'none' | 'staff' | 'admin' | 'chef'> = new EventEmitter();

  constructor() {
    this.loadAuthStatus();
  }

  loginAsAdmin() {
    this.userRole = 'admin';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  loginAsStaff() {
    this.userRole = 'staff';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  loginAsChef() {
    this.userRole = 'chef';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  logout() {
    this.userRole = 'none';
    this.saveAuthStatus();
    this.authStatusChanged.emit(this.userRole);
  }

  getAuthStatus() {
    return this.userRole !== 'none';
  }

  getStaffStatus() {
    return this.userRole === 'staff';
  }

  getChefStatus() {
    return this.userRole === 'chef';
  }


  getAdminStatus() {
    return this.userRole === 'admin';
  }

  private saveAuthStatus() {
    localStorage.setItem('userRole', this.userRole);
  }

  private loadAuthStatus() {
    const savedUserRole = localStorage.getItem('userRole') as 'none' | 'staff' | 'admin'  | 'chef';
    if (savedUserRole) {
      this.userRole = savedUserRole;
      this.authStatusChanged.emit(this.userRole); 
    }
  }

  ngOnDestroy(): void {
      localStorage.removeItem('userRole');
  }
}
