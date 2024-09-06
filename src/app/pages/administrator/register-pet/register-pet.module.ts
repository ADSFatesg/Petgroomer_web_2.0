import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RegisterPetComponent } from './register-pet.component';



@NgModule({
  declarations: [RegisterPetComponent],
  imports: [
   SharedModule
  ]
})
export class RegisterPetModule { }
