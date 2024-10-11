import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'administrator',
    loadChildren: () => import('./pages/enterprise/administrator.module').then(m => m.AdministratorModule),
    canActivate: [AuthGuard],

  },
  {
    path: 'client',
    loadChildren: () => import('./pages/Client/client.module').then(m => m.ClientModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'employee',
    loadChildren: () => import('./pages/enterprise/employees.module').then(m => m.EmployeesModule),
    canActivate: [AuthGuard],
  },
  {
    path: '', component: LoginComponent
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
