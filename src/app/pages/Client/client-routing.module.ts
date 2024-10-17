import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenuClientComponent} from "./menu-client/menu-client.component";
import {ListPetComponent} from "./list-pet/list-pet.component";
import {ClientRegisterPetComponent} from "./client-register-pet/client-register-pet.component";
import {ClientSchedulingComponent} from "./client-scheduling/client-scheduling.component";
import {ListSchedulingClientComponent} from "./list-scheduling-client/list-scheduling-client.component";
import {AuthGuard} from "../../authentication/auth.guard";
import {ClientHomeComponent} from "./client-home/client-home.component";


const routes: Routes = [
  {
    path: '',
    component:MenuClientComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'clientPetRegister', component: ClientRegisterPetComponent, canActivate: [AuthGuard] },
      { path: 'listPet', component: ListPetComponent, canActivate: [AuthGuard]},
      { path: 'clientScheduling', component:ClientSchedulingComponent, canActivate: [AuthGuard]},
     { path: 'listSchedulingClient', component: ListSchedulingClientComponent, canActivate: [AuthGuard]},
      { path: 'clientHome', component: ClientHomeComponent, canActivate: [AuthGuard]},
      { path: '', redirectTo: 'clientHome', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
