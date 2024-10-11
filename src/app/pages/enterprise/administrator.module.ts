import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorRoutingModule } from './administrator-routing.module';
import { MenuAdminstratorModule } from './menu-adminstrator/menu-adminstrator.module';
import { AgendaModule } from './agenda/agenda.module';
import { SharedModule } from '../../shared/shared.module';
import { RegisterClientModule } from './register-client/register-client.module';
import { ConsultClientModule } from './consult-client/consult-client.module';
import { RegisterEmployeeModule } from './register-employee/register-employee.module';
import { ConsultEmployeeModule } from './consult-employee/consult-employee.module';
import { RegisterPetModule } from './register-pet/register-pet.module';
import { ConsultPetModule } from './consult-pet/consult-pet.module';
import { ServiceModule } from './service/service.module';
import { ListServiceModule } from './list-service/list-service.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { ListSchedulingModule } from './list-scheduling/list-scheduling.module';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    MenuAdminstratorModule,
    AgendaModule,
    SharedModule,
    RegisterClientModule,
    ConsultClientModule,
    RegisterEmployeeModule,
    ConsultEmployeeModule,
    RegisterPetModule,
    ConsultPetModule,
    ServiceModule,
    ListServiceModule,
    SchedulingModule,
    ListSchedulingModule
  ]
})
export class AdministratorModule { }
