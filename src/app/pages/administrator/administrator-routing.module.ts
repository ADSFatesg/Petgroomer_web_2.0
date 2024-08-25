import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAdminstratorComponent } from './menu-adminstrator/menu-adminstrator.component';
import { AgendaComponent } from './agenda/agenda.component';
import { RegisterClientComponent } from './register-client/register-client.component';
import { ConsultClientComponent } from './consult-client/consult-client.component';

const routes: Routes = [
    { path: '', component: MenuAdminstratorComponent, children: [
      { path: '', component: AgendaComponent },
      { path: 'registerClient', component:RegisterClientComponent },
      { path: 'consultClient', component:ConsultClientComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }