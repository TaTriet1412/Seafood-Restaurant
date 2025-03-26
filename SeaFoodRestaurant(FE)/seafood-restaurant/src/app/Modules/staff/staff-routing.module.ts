import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';

const routes: Routes = [
  { path: "", 
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'tables',
        loadChildren: () => import('./views/tables/routes').then(m => m.routes)
      },
      { path: "", redirectTo: 'tables', pathMatch: 'full'},


      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'theme',
      //   loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'base',
      //   loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      // },
      // {
      //   path: 'pages',
      //   loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      // },
      // { path: "", redirectTo: 'dashboard', pathMatch: 'full'},
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
