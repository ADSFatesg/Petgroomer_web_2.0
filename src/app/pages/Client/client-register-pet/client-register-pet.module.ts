import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientRegisterPetComponent} from "./client-register-pet.component";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    ClientRegisterPetComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ClientRegisterPetModule { }
