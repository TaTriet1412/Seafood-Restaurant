import { Routes } from '@angular/router';
import { ROUTES } from '../../../../core/constants/routes.constant';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bills'
    },
    children: [
      {
        path: '',
        redirectTo: ROUTES.ADMIN.children.BILL.children.SHIFT.path,
        pathMatch: 'full'
      },
      {
        path: ROUTES.ADMIN.children.BILL.children.SHIFT.path,
        loadComponent: () => import('./bills-shifts/bills-shifts.component').then(m => m.BillsShiftsComponent),
        data: {
          title: 'Shift'
        }
      },
      {
        path: ROUTES.ADMIN.children.BILL.children.DATE.path,
        loadComponent: () => import('./bills-date/bills-date.component').then(m => m.BillsDateComponent),
        data: {
          title: 'Date'
        }
      },
      {
        path: ROUTES.ADMIN.children.BILL.children.DETAIL.path,
        loadComponent: () => import('./bills-details/bills-details.component').then(m => m.BillsDetailsComponent),
        data: {
          title: 'Detail'
        }
      },
    ]
  }
];


