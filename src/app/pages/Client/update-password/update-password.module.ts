import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UpdatePasswordComponent} from "./update-password.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    UpdatePasswordComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UpdatePasswordModule { }
