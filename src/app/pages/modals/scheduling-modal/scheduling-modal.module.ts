import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { SchedulingModalComponent } from './scheduling-modal.component';



@NgModule({
  declarations: [SchedulingModalComponent],
  imports: [
    SharedModule
  ]
})
export class SchedulingModalModule { }
