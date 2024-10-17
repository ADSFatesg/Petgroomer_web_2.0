import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeMainRoutingModule } from './home-main-routing.module';
import {HomeMainComponent} from "./home-main/home-main.component";
import {LoginModule} from "../login/login.module";
import {CadastrarModule} from "./cadastrar/cadastrar.module";


@NgModule({
  declarations: [
    HomeMainComponent
  ],
  imports: [
    CommonModule,
    HomeMainRoutingModule,
    LoginModule,
    CadastrarModule
  ]
})
export class HomeMainModule { }
