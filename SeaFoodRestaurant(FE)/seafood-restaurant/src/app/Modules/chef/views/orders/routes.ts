import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Orders'
        },
        children: [
            {
                path: '',
                redirectTo: 'orders-management',
                pathMatch: 'full'
            },
            {
                path: 'orders-management',
                loadComponent: () => 
                    import('./orders-management/orders-management.component')
                        .then(m => m.OrdersManagementComponent),
                data: {
                    title: 'Orders-Management'
                }
            },
            {
                path: 'order-details',
                loadComponent: () => 
                    import('./order-details/order-details.component')
                        .then(m => m.OrderDetailsComponent),
                data: {
                    title: 'Order-Details'
                }
            }
        ]
    }
];