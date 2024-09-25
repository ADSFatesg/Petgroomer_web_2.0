import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ServiceModalComponent } from './service-modal.component';



@NgModule({
  declarations: [
    ServiceModalComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ServiceModalModule { }
