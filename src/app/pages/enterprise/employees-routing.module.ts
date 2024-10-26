import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../authentication/auth.guard";
import {AgendaComponent} from "./agenda/agenda.component";
import {RegisterClientComponent} from "./register-client/register-client.component";
import {ConsultClientComponent} from "./consult-client/consult-client.component";
import {RegisterEmployeeComponent} from "./register-employee/register-employee.component";
import {ConsultEmployeeComponent} from "./consult-employee/consult-employee.component";
import {RegisterPetComponent} from "./register-pet/register-pet.component";
import {ConsultPetComponent} from "./consult-pet/consult-pet.component";
import {ServiceComponent} from "./service/service.component";
import {ListServiceComponent} from "./list-service/list-service.component";
import {SchedulingComponent} from "./scheduling/scheduling.component";
import {ListSchedulingComponent} from "./list-scheduling/list-scheduling.component";
import {MenuEmployeeComponent} from "./menu-employee/menu-employee.component";


const routes: Routes = [
  {
    path: '',
    component: MenuEmployeeComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_EMPLOYEE' },
    children: [
      { path: '', component: AgendaComponent, canActivate: [AuthGuard]},
      { path: 'clientRegister', component: RegisterClientComponent, canActivate: [AuthGuard]},
      { path: 'clientConsult', component: ConsultClientComponent, canActivate: [AuthGuard]},
      { path: 'petRegister', component: RegisterPetComponent, canActivate: [AuthGuard],},
      { path: 'petConsult', component: ConsultPetComponent, canActivate: [AuthGuard]},
      { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard]},
      { path: 'serviceRegister', component: ServiceComponent, canActivate: [AuthGuard]},
      { path: 'serviceList', component: ListServiceComponent, canActivate: [AuthGuard]},
      { path: 'schedulingRegister', component: SchedulingComponent, canActivate: [AuthGuard]},
      { path: 'schedulingList', component: ListSchedulingComponent, canActivate: [AuthGuard]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
