import { ListSchedulingComponent } from './list-scheduling/list-scheduling.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { MenuAdminstratorComponent } from './menu-adminstrator/menu-adminstrator.component';
import { AgendaComponent } from './agenda/agenda.component';
import { RegisterClientComponent } from './register-client/register-client.component';
import { ConsultClientComponent } from './consult-client/consult-client.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { ConsultEmployeeComponent } from './consult-employee/consult-employee.component';
import { RegisterPetComponent } from './register-pet/register-pet.component';
import { ConsultPetComponent } from './consult-pet/consult-pet.component';
import { AuthGuard } from '../../authentication/auth.guard';
import { ServiceComponent } from './service/service.component';
import { ListServiceComponent } from './list-service/list-service.component';
import { SchedulingComponent } from './scheduling/scheduling.component';

const routes: Routes = [
  {
    path: '',
    component: MenuAdminstratorComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AgendaComponent, canActivate: [AuthGuard]},
      { path: 'registerClient', component: RegisterClientComponent, canActivate: [AuthGuard]},
      { path: 'consultClient', component: ConsultClientComponent, canActivate: [AuthGuard]},
      { path: 'registerEmployee', component: RegisterEmployeeComponent, canActivate: [AuthGuard],},
      { path: 'consultEmployee', component: ConsultEmployeeComponent, canActivate: [AuthGuard],},
      { path: 'registerPet', component: RegisterPetComponent, canActivate: [AuthGuard],},
      { path: 'consultPet', component: ConsultPetComponent, canActivate: [AuthGuard]},
      { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard]},
      { path: 'registerService', component: ServiceComponent, canActivate: [AuthGuard]},
      { path: 'listService', component: ListServiceComponent, canActivate: [AuthGuard]},
      { path: 'scheduling', component: SchedulingComponent, canActivate: [AuthGuard]},
      { path: 'listScheduling', component: ListSchedulingComponent, canActivate: [AuthGuard]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorRoutingModule {}
