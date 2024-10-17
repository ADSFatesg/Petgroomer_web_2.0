import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientHomeComponent} from "./client-home.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ClientHomeComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ClientHomeModule { }
