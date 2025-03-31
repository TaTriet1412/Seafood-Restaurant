import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Menu'
        },
        children: [
            {
                path: '',
                redirectTo: ROUTES.STAFF.children.MENU.children.LIST.path,
                pathMatch: 'full'
            },
            {
                path: ROUTES.STAFF.children.MENU.children.LIST.path,
                loadComponent: () => 
                    import('./menu-items/menu-items.component')
                        .then(m => m.MenuItemsComponent),
                data: {
                    title: 'List'
                }
            },
        ]
    }
];