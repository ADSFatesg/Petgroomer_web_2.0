import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterEmployeeComponent } from './register-employee.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [RegisterEmployeeComponent],
  imports: [
    SharedModule
  ]
})
export class RegisterEmployeeModule { }
