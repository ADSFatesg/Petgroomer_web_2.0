import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSchedulingComponent } from './list-scheduling.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    ListSchedulingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ListSchedulingModule { }
