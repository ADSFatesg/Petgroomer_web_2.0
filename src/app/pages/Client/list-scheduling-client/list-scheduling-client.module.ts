import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListSchedulingClientComponent} from "./list-scheduling-client.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ListSchedulingClientComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ListSchedulingClientModule { }
