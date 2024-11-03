import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministratorModule } from './pages/enterprise/administrator.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './exceptions/erro-interceptor.service';
import { TokenInterceptorService } from './authentication/token-interceptor.service';
import { LoginModule } from './pages/homeMain/login/login.module';
import {SharedModule} from "./shared/shared.module";
import {ClientModule} from "./pages/Client/client.module";
import {EmployeesModule} from "./pages/enterprise/employees.module";
import {HomeMainModule} from "./pages/homeMain/home-main.module";
import {RequestResetPasswordComponent} from "./pages/homeMain/request-reset-password/request-reset-password.component";
import {ResetPasswordComponent} from "./pages/homeMain/reset-password/reset-password.component";



@NgModule({
  declarations: [
    AppComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdministratorModule,
    ClientModule,
    EmployeesModule,
    HttpClientModule,
    LoginModule,
    SharedModule,
    HomeMainModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS,useClass: TokenInterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
