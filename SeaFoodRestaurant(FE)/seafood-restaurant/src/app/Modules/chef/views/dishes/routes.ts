import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Dishes'
        },
        children: [
            {
                path: '',
                redirectTo: 'dishes-management',
                pathMatch: 'full'
            },
            {
                path: 'dishes-management',
                loadComponent: () => 
                    import('./dishes-management/dishes-management.component')
                        .then(m => m.DishesManagementComponent),
                data: {
                    title: 'Dishes-Management'
                }
            }
        ]
    }
];