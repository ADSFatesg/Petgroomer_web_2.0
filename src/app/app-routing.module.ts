import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import {HomeMainComponent} from "./pages/homeMain/home-main/home-main.component";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/homeMain/home-main.module').then(m => m.HomeMainModule)
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
    path: '', component:HomeMainComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
