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
      {
        path: 'menu',
        loadChildren: () => import('./views/menu/routes').then(m => m.routes)
      },
      { path: "", redirectTo: 'menu', pathMatch: 'full'},


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
