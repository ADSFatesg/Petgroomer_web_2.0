import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RegisterClientComponent } from './register-client.component';



@NgModule({
  declarations: [
    RegisterClientComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RegisterClientModule { }
