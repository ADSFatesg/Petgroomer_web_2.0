import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterPetComponent} from "../administrator/register-pet/register-pet.component";
import {ConsultPetComponent} from "../administrator/consult-pet/consult-pet.component";
import {SchedulingComponent} from "../administrator/scheduling/scheduling.component";
import {ListSchedulingComponent} from "../administrator/list-scheduling/list-scheduling.component";
import {MenuClientComponent} from "./menu-client/menu-client.component";

const routes: Routes = [
  {
    path: '',
    component:MenuClientComponent,
    children: [
      { path: 'registerPet', component: RegisterPetComponent },
      { path: 'consultPet', component: ConsultPetComponent },
      { path: 'scheduling', component: SchedulingComponent},
      { path: 'listScheduling', component: ListSchedulingComponent },
      { path: '', redirectTo: 'consultPet', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
