import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministratorModule } from './pages/enterprise/administrator.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './exceptions/erro-interceptor.service';
import { TokenInterceptorService } from './authentication/token-interceptor.service';
import { LoginModule } from './pages/login/login.module';
import { MenuClientComponent } from './pages/Client/menu-client/menu-client.component';
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {SharedModule} from "./shared/shared.module";
import {ClientModule} from "./pages/Client/client.module";
import {EmployeesModule} from "./pages/enterprise/employees.module";
import { HomeMainComponent } from './pages/homeMain/home-main/home-main.component';
import {HomeMainModule} from "./pages/homeMain/home-main.module";


@NgModule({
  declarations: [
    AppComponent,
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
