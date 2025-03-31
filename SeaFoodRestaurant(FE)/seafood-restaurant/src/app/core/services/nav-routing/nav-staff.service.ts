import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/routes.constant.';

@Injectable({
    providedIn: 'root'
})
export class NavStaffService {
    constructor(private router: Router) { }

    goToHome() {
        this.router.navigate([ROUTES.HOME.fullPath]);
    }

    // TABLE

    goToTableList(): Promise<boolean> {
        return this.router.navigate([ROUTES.STAFF.children.TABLE.children.LIST.fullPath])
    }

    goToTableOrder(tableId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.STAFF.children.TABLE.children.ORDER.fullPath(tableId)])
    }

    goToTableBill(tableId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.STAFF.children.TABLE.children.BILL.fullPath(tableId)])
    }

    // MENU

    goToMenuList(): Promise<boolean> {
        return this.router.navigate([ROUTES.STAFF.children.MENU.children.LIST.fullPath])
    }


    // Phương thức quay lại trang trước
    goBack(): void {
        window.history.back();
    }

}
