import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministratorModule } from './pages/administrator/administrator.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './exceptions/erro-interceptor.service';
import { TokenInterceptorService } from './authentication/token-interceptor.service';
import { LoginModule } from './pages/login/login.module';
import { EmployeeModalComponent } from './pages/modals/employee-modal/employee-modal.component';
import { ServiceModalComponent } from './pages/modals/service-modal/service-modal.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdministratorModule,
    HttpClientModule,
    LoginModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS,useClass: TokenInterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
