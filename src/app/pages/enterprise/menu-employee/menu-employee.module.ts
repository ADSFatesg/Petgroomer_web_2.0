import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuEmployeeComponent} from "./menu-employee.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    MenuEmployeeComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MenuEmployeeModule { }
