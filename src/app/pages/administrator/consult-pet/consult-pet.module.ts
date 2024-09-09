import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultPetComponent } from './consult-pet.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    ConsultPetComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ConsultPetModule { }
