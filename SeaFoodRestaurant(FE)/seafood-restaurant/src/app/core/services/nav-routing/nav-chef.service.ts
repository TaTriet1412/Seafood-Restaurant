import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../constants/routes.constant';

@Injectable({
    providedIn: 'root'
})
export class NavChefService {
    constructor(private router: Router) { }

    goToHome() {
        this.router.navigate([ROUTES.HOME.fullPath]);
    }

    // DISH

    goToDishList(): Promise<boolean> {
        return this.router.navigate([ROUTES.CHEF.children.DISH.fullPath])
    }

    // ORDER

    goToOrderList(): Promise<boolean> {
        return this.router.navigate([ROUTES.CHEF.children.ORDER.children.LIST.fullPath])
    }

    goToOrderDetail(orderId: string): Promise<boolean> {
        return this.router.navigate([ROUTES.CHEF.children.ORDER.children.DETAIL.fullPath(orderId)])
    }


}
