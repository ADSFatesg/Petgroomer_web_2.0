import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { MenuAdminstratorModule } from './menu-adminstrator/menu-adminstrator.module';
import { AgendaModule } from './agenda/agenda.module';
import { SharedModule } from '../../shared/shared.module';
import { RegisterClientModule } from './register-client/register-client.module';
import { ConsultClientModule } from './consult-client/consult-client.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    MenuAdminstratorModule,
    AgendaModule,
    SharedModule,
    RegisterClientModule,
    ConsultClientModule
  ]
})
export class AdministratorModule { }
