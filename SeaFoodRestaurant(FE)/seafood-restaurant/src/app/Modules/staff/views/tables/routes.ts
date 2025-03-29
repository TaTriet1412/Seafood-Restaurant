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
                redirectTo: 'tables-management',
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
            {
                path: 'table-bill',
                loadComponent: () => 
                    import('./table-bill/table-bill.component')
                        .then(m => m.TableBillComponent),
                data: {
                    title: 'Bill'
                }
            },
        ]
    }
];