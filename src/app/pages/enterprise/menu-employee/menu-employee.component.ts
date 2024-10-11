import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../authentication/auth.service";

@Component({
  selector: 'app-menu-employee',
  templateUrl: './menu-employee.component.html',
  styleUrl: './menu-employee.component.scss'
})
export class MenuEmployeeComponent {
  isMenuOpened = false;
  constructor(private router: Router, private authService: AuthService) {}


  // Método de logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
