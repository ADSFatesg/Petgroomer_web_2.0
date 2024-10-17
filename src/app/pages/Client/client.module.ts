import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import {MenuClientModule} from "./menu-client/menu-client.module";
import {ListPetModule} from "./list-pet/list-pet.module";
import {ClientRegisterPetModule} from "./client-register-pet/client-register-pet.module";
import {ClientSchedulingModule} from "./client-scheduling/client-scheduling.module";
import {ListSchedulingClientModule} from "./list-scheduling-client/list-scheduling-client.module";
import { ClientHomeComponent } from './client-home/client-home.component';
import {ClientHomeModule} from "./client-home/client-home.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MenuClientModule,
    ListPetModule,
    ClientRegisterPetModule,
    ClientSchedulingModule,
    ListSchedulingClientModule,
    ClientHomeModule
  ]
})
export class ClientModule { }
