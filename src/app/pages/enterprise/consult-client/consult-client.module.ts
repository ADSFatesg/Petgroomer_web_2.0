import { NgModule } from '@angular/core';
import { ConsultClientComponent } from './consult-client.component';
import { SharedModule } from '../../../shared/shared.module';
import { ClientModalModule } from '../../modals/client-modal/client-modal.module';



@NgModule({
  declarations: [ConsultClientComponent],
  imports: [
    SharedModule,
    ClientModalModule
  ]
})
export class ConsultClientModule { }
