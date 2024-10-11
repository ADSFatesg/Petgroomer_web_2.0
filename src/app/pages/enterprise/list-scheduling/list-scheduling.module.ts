import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSchedulingComponent } from './list-scheduling.component';
import { SharedModule } from '../../../shared/shared.module';
import { SchedulingModalModule } from '../../modals/scheduling-modal/scheduling-modal.module';



@NgModule({
  declarations: [
    ListSchedulingComponent
  ],
  imports: [
    SharedModule,
    SchedulingModalModule
  ]
})
export class ListSchedulingModule { }
