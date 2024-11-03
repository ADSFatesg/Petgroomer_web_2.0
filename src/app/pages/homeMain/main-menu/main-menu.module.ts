import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {MainMenuComponent} from "./main-menu.component";



@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MainMenuModule { }
