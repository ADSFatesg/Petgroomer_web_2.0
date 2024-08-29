import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultEmployeeComponent } from './consult-employee.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [ConsultEmployeeComponent],
  imports: [
    SharedModule
  ]
})
export class ConsultEmployeeModule { }
