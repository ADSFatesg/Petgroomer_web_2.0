import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {MenuClientComponent} from "./menu-client.component";


@NgModule({
  declarations: [
    MenuClientComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MenuClientModule { }
