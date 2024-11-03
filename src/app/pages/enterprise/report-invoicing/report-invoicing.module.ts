import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportInvoicingComponent } from './report-invoicing.component';
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ReportInvoicingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ReportInvoicingModule { }
