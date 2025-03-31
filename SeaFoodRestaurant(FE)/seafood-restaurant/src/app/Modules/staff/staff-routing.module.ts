import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { ROUTES } from '../../core/constants/routes.constant';

const default_url: string = ROUTES.STAFF.children.TABLE.path;

const routes: Routes = [
  { path: "", 
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.STAFF.children.TABLE.path,
        loadChildren: () => import('./views/tables/routes').then(m => m.routes)
      },
      {
        path: ROUTES.STAFF.children.MENU.path,
        loadChildren: () => import('./views/menu/routes').then(m => m.routes)
      },
      { path: "", redirectTo: default_url, pathMatch: 'full'},


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
