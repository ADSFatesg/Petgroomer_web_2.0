import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import {MenuClientComponent} from "./menu-client/menu-client.component";
import {MenuClientModule} from "./menu-client/menu-client.module";


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MenuClientModule
  ]
})
export class ClientModule { }
