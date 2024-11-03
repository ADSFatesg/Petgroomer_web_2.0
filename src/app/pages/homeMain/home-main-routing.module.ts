import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {CadastrarComponent} from "./cadastrar/cadastrar.component";
import {MainMenuComponent} from "./main-menu/main-menu.component";
import {HomeComponent} from "./home/home.component";
import {RequestResetPasswordComponent} from "./request-reset-password/request-reset-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

const routes: Routes = [
  {
    path: '',
    component:MainMenuComponent,
    children: [
      {
        path: '',
        component:HomeComponent
      },
      {
        path: 'login',
        component:LoginComponent
      },
      {
        path: 'register',
        component: CadastrarComponent
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'request-reset-password',
        component: RequestResetPasswordComponent
      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeMainRoutingModule { }
