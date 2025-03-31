import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { ROUTES } from '../../core/constants/routes.constant';

const default_url = ROUTES.CHEF.children.DISH.path;

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: ROUTES.CHEF.children.DISH.path,
        loadChildren: () => import('./views/dishes/routes').then(m => m.routes)
      },
      {
        path: ROUTES.CHEF.children.ORDER.path,
        loadChildren: () => import('./views/orders/routes').then(m => m.routes)
      },
      { path: "", redirectTo: default_url, pathMatch: 'full' },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefRoutingModule { }
