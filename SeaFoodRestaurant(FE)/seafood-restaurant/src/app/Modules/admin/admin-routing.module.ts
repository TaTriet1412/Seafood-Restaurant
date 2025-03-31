import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { ROUTES } from '../../core/constants/routes.constant';

const default_url: string =  ROUTES.ADMIN.children.TABLE.path;

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.ADMIN.children.TABLE.path,
        loadChildren: () => import('./views/tables/routes').then(m => m.routes)
      },
      {
        path: ROUTES.ADMIN.children.MENU.path,
        loadChildren: () => import('./views/menu/routes').then(m => m.routes)
      },
      {
        path: ROUTES.ADMIN.children.BILL.path,
        loadChildren: () => import('./views/bills/routes').then(m => m.routes)
      },
      { path: "", redirectTo:  default_url, pathMatch: 'full' },


    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
