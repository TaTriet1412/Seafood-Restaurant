import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bills'
    },
    children: [
      {
        path: '',
        redirectTo: 'bills-details',
        pathMatch: 'full'
      },
      {
        path: 'bills-shifts',
        loadComponent: () => import('./bills-shifts/bills-shifts.component').then(m => m.BillsShiftsComponent),
        data: {
          title: 'Bills-Shifts'
        }
      },
      {
        path: 'bills-date',
        loadComponent: () => import('./bills-date/bills-date.component').then(m => m.BillsDateComponent),
        data: {
          title: 'Bills-Date'
        }
      },
      {
        path: 'bills-details',
        loadComponent: () => import('./bills-details/bills-details.component').then(m => m.BillsDetailsComponent),
        data: {
          title: 'Bills-Details'
        }
      },
    ]
  }
];


