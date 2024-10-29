import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComissionComponent } from './report-comission.component';
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ReportComissionComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ReportComissionModule { }
