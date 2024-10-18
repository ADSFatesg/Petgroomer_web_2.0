import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserAccountComponent} from "./user-account.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    UserAccountComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UserAccountModule { }
