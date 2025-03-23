import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { LoginComponent } from './default-ui/login/login.component';

const routes: Routes = [
  { path: "", component: DefaultUiComponent,children: [
      { path: "login", component:  LoginComponent},
      { path: "", redirectTo: 'login', pathMatch: 'full'},
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: "**", redirectTo: ""}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
