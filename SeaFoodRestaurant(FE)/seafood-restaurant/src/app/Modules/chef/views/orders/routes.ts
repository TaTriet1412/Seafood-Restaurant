import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

const default_url = ROUTES.CHEF.children.ORDER.children.LIST.path;

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Orders'
        },
        children: [
            {
                path: '',
                redirectTo: default_url,
                pathMatch: 'full'
            },
            {
                path: ROUTES.CHEF.children.ORDER.children.LIST.path,
                loadComponent: () => 
                    import('./orders-management/orders-management.component')
                        .then(m => m.OrdersManagementComponent),
                data: {
                    title: 'List'
                }
            },
            {
                path: ROUTES.CHEF.children.ORDER.children.DETAIL.path,
                loadComponent: () => 
                    import('./order-details/order-details.component')
                        .then(m => m.OrderDetailsComponent),
                data: {
                    title: 'Detail'
                }
            }
        ]
    }
];