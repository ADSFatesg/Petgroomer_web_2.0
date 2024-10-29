import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {MenuEmployeeModule} from "./menu-employee/menu-employee.module";
import {AgendaModule} from "./agenda/agenda.module";
import {RegisterClientModule} from "./register-client/register-client.module";
import {ConsultClientModule} from "./consult-client/consult-client.module";
import {RegisterPetModule} from "./register-pet/register-pet.module";
import {ConsultPetModule} from "./consult-pet/consult-pet.module";
import {ServiceModule} from "./service/service.module";
import {ListServiceModule} from "./list-service/list-service.module";
import {SchedulingModule} from "./scheduling/scheduling.module";
import {ListSchedulingModule} from "./list-scheduling/list-scheduling.module";
import {ReportComissionModule} from "./report-comission/report-comission.module";
import {UsersModule} from "./users/users.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    SharedModule,
    MenuEmployeeModule,
    AgendaModule,
    SharedModule,
    RegisterClientModule,
    ConsultClientModule,
    RegisterPetModule,
    ConsultPetModule,
    ServiceModule,
    ListServiceModule,
    SchedulingModule,
    ListSchedulingModule,
    ReportComissionModule
  ]
})
export class EmployeesModule { }
