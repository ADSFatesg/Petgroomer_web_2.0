import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeMainComponent} from "./home-main/home-main.component";
import {LoginComponent} from "../login/login.component";
import {RegisterClientComponent} from "../enterprise/register-client/register-client.component";
import {CadastrarComponent} from "./cadastrar/cadastrar.component";

const routes: Routes = [
  {
    path: '',
    component:HomeMainComponent
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'register',
    component: CadastrarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeMainRoutingModule { }
