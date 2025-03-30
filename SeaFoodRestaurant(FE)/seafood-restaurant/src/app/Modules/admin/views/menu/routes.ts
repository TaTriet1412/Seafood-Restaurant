import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Menu'
        },
        children: [
            {
                path: '',
                redirectTo: 'menu-items',
                pathMatch: 'full'
            },
            {
                path: 'menu-items',
                loadComponent: () => 
                    import('./menu-items/menu-items.component')
                        .then(m => m.MenuItemsComponent),
                data: {
                    title: 'Items'
                }
            },
        ]
    }
];