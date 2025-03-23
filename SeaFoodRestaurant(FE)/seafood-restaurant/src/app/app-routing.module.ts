import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from './core/guards/auth_admin.guard';
import { AuthStaffGuard } from './core/guards/auth_staff.guard';
import { AuthChefGuard } from './core/guards/auth_chef.guard';

const routes: Routes = [
  { 
    path: 'user', 
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule) 
  },
  {
    path: 'admin',
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthAdminGuard]
  },
  { path: 'staff', 
    loadChildren: () => import('./Modules/staff/staff.module').then(m => m.StaffModule), 
    canActivate: [AuthStaffGuard] 
  },
  { path: 'chef', 
    loadChildren: () => import('./Modules/chef/chef.module').then(m => m.ChefModule), 
    canActivate: [AuthChefGuard] 
  },
  //Khi trang rỗng (ban đầu) thì trang trả về path user 
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  //Tất cả đường dẫn không tồn tại thì trả về path user
  { path: '**', redirectTo: 'user' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
