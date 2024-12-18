import { AuthService } from './../../../authentication/auth.service';
import {Component} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-adminstrator',
  templateUrl: './menu-adminstrator.component.html',
  styleUrls: ['./menu-adminstrator.component.scss'],
})
export class MenuAdminstratorComponent {
  isMenuOpened = false;
  constructor(private router: Router, private authService: AuthService) {}


  // Método de logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
