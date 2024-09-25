import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ClientModalComponent } from './client-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [ClientModalComponent],
  imports: [
    SharedModule,
    MatIconModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientModalModule { }
