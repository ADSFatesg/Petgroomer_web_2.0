import { NgModule } from '@angular/core';
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
