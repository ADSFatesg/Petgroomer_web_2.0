import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuAdminstratorComponent } from './menu-adminstrator.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    MenuAdminstratorComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MenuAdminstratorModule { }
