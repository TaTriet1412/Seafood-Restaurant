import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/routes.constant.';

@Injectable({
    providedIn: 'root'
})
export class NavAdminService {
    constructor(private router: Router) { }

    goToHome() {
        this.router.navigate([ROUTES.HOME.fullPath]);
    }

    // TABLE

    goToTableList(): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.TABLE.children.LIST.fullPath])
    }

    goToTableOrder(tableId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.TABLE.children.ORDER.fullPath(tableId)])
    }

    goToTableBill(tableId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.TABLE.children.BILL.fullPath(tableId)])
    }

    // MENU

    goToMenuList(): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.MENU.children.LIST.fullPath])
    }

    // BILL

    // goToBillsListWithFilter(filter: string): Promise<boolean> {
    //     return this.router.navigate([ROUTES.ADMIN.children.BILL.fullPath], {
    //         queryParams: { filter }
    //     });
    // }

    goToBillDetail(billId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.BILL.children.DETAIL.fullPath(billId)])
    }

    goToBillFilterByShift(): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.BILL.children.SHIFT.fullPath])
    }

    goToBillFilterByDate(): Promise<boolean> {
        return this.router.navigate([ROUTES.ADMIN.children.BILL.children.DATE.fullPath])
    }

    // Phương thức quay lại trang trước
    goBack(): void {
        window.history.back();
    }


    // goToTableDetail(tableId: string): Promise<boolean> {
    //     return this.router.navigate([ROUTES.TABLES.children.DETAIL.fullPath(tableId)]);
    // }

    // Phương thức điều hướng với query params
    // goToBillsListWithFilter(filter: string): Promise<boolean> {
    //     return this.router.navigate([ROUTES.BILLS.fullPath], {
    //         queryParams: { filter }
    //     });
    // }

    // Phương thức điều hướng với state
    //   goToTableDetailWithState(tableId: string, state: any): Promise<boolean> {
    //     return this.router.navigate([ROUTES.TABLES.children.DETAIL.fullPath(tableId)], {
    //       state
    //     });
    //   }

}
