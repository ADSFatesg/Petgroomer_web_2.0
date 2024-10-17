import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarComponent } from './cadastrar.component';
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    CadastrarComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CadastrarModule { }
