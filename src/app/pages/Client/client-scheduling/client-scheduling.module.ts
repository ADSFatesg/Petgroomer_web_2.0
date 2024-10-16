import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientSchedulingComponent} from "./client-scheduling.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ClientSchedulingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ClientSchedulingModule { }
