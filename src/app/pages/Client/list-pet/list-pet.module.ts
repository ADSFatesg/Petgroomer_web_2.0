import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {ListPetComponent} from "./list-pet.component";



@NgModule({
  declarations: [
    ListPetComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ListPetModule { }
