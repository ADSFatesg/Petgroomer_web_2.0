import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeMainRoutingModule } from './home-main-routing.module';
import {LoginModule} from "./login/login.module";
import {CadastrarModule} from "./cadastrar/cadastrar.module";
import {MainMenuModule} from "./main-menu/main-menu.module";
import {ResetPasswordModule} from "./reset-password/reset-password.module";
import {RequestResetPasswordModule} from "./request-reset-password/request-reset-password.module";
import {HomeModule} from "./home/home.module";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    HomeMainRoutingModule,
    LoginModule,
    CadastrarModule,
    MainMenuModule,
    ResetPasswordModule,
    RequestResetPasswordModule,
    HomeModule
  ]
})
export class HomeMainModule { }
