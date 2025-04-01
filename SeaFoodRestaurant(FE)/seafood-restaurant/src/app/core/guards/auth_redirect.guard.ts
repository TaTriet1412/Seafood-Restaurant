import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/routes.constant';

@Injectable({
    providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate():  boolean{
        if (this.authService.getAdminStatus()) {
            this.router.navigate([`/${ROUTES.ADMIN.path}`]);
            return false;
        } else if (this.authService.getStaffStatus()) {
            this.router.navigate([`/${ROUTES.STAFF.path}`]);
            return false;
        } else if (this.authService.getChefStatus()) {
            this.router.navigate([`/${ROUTES.CHEF.path}`]);
            return false;
        } else {
            return true;
        }
    }
}