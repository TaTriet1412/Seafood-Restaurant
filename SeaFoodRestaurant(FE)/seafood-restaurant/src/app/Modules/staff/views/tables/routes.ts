import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Tables'
        },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: ROUTES.STAFF.children.TABLE.children.LIST.path,
                loadComponent: () =>
                    import('./tables-management/tables-management.component')
                        .then(m => m.TablesManagementComponent),
                data: {
                    title: 'List'
                },
            },
            {
                path: ROUTES.STAFF.children.TABLE.children.ORDER.path,
                loadComponent: () =>
                    import('./table-order/table-order.component')
                        .then(m => m.TableOrderComponent),
                data: {
                    title: 'Table-Order'
                },
            },
            {
                path: ROUTES.STAFF.children.TABLE.children.BILL.path,
                loadComponent: () =>
                    import('./table-bill/table-bill.component')
                        .then(m => m.TableBillComponent),
                data: {
                    title: 'Table-Bill'
                },
            }
        ],
    }
];