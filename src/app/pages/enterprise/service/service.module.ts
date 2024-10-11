import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ServiceModule { }
