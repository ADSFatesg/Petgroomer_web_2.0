import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaComponent } from './agenda.component';
import {MatCell, MatHeaderCell} from "@angular/material/table";
import {SharedModule} from "../../../shared/shared.module";



@NgModule({
  declarations: [
    AgendaComponent
  ],
  imports: [
    CommonModule,
    MatHeaderCell,
    MatCell,
    SharedModule
  ]
})
export class AgendaModule { }
