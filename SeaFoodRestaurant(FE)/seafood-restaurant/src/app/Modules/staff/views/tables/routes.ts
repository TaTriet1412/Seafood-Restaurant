import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Tables'
        },
        children: [
            {
                path: '',
                redirectTo: 'table-order',
                pathMatch: 'full'
            },
            {
                path: 'tables-management',
                loadComponent: () => 
                    import('./tables-management/tables-management.component')
                        .then(m => m.TablesManagementComponent),
                data: {
                    title: 'Tables-Management'
                }
            },
            {
                path: 'table-order',
                loadComponent: () => 
                    import('./table-order/table-order.component')
                        .then(m => m.TableOrderComponent),
                data: {
                    title: 'Table-Order'
                }
            },
        ]
    }
];