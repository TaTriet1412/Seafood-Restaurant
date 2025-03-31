import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from './core/guards/auth_admin.guard';
import { AuthStaffGuard } from './core/guards/auth_staff.guard';
import { AuthChefGuard } from './core/guards/auth_chef.guard';
import { ROUTES } from './core/constants/routes.constant';

const default_url_role = ROUTES.CHEF.path;

const routes: Routes = [
  { 
    path: 'user', 
    loadChildren: () => import('./Modules/user/user.module').then(m => m.UserModule) 
  },
  {
    path: ROUTES.ADMIN.path,
    loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule),
    // canActivate: [AuthAdminGuard]
  },
  { path: ROUTES.STAFF.path, 
    loadChildren: () => import('./Modules/staff/staff.module').then(m => m.StaffModule), 
    // canActivate: [AuthStaffGuard] 
  },
  { path: ROUTES.CHEF.path, 
    loadChildren: () => import('./Modules/chef/chef.module').then(m => m.ChefModule), 
    // canActivate: [AuthChefGuard] 
  },
  // role de test giao dien
  { path: 'test-user', 
    loadChildren: () => import('./Modules/test-user/test-user.module').then(m => m.TestUserModule), 
  },
  //Khi trang rỗng (ban đầu) thì trang trả về path user 
  { path: '', redirectTo: default_url_role, pathMatch: 'full' },
  //Tất cả đường dẫn không tồn tại thì trả về path user
  { path: '**', redirectTo: default_url_role },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
