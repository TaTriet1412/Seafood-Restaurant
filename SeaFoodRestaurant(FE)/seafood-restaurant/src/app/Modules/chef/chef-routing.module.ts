import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';

const routes: Routes = [
  {
    path: "",
    component: DefaultUiComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dishes',
        loadChildren: () => import('./views/dishes/routes').then(m => m.routes)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/orders/routes').then(m => m.routes)
      },
      { path: "", redirectTo: 'dishes', pathMatch: 'full' },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefRoutingModule { }
