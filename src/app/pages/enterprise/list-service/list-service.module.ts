import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServiceComponent } from './list-service.component';
import { SharedModule } from '../../../shared/shared.module';
import { ServiceModalModule } from '../../modals/service-modal/service-modal.module';



@NgModule({
  declarations: [
    ListServiceComponent
  ],
  imports: [
    SharedModule,
    ServiceModalModule
  ]
})
export class ListServiceModule { }
