import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultClientComponent } from './consult-client.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    ConsultClientComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ConsultClientModule { }
