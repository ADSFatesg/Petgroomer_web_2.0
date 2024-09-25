import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultEmployeeComponent } from './consult-employee.component';
import { SharedModule } from '../../../shared/shared.module';
import { EmployeeModalModule } from '../../modals/employee-modal/employee-modal.module';



@NgModule({
  declarations: [ConsultEmployeeComponent],
  imports: [
    SharedModule,
    EmployeeModalModule
  ]
})
export class ConsultEmployeeModule { }
