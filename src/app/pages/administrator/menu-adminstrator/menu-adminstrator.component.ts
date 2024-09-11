import { AuthService } from './../../../authentication/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-adminstrator',
  templateUrl: './menu-adminstrator.component.html',
  styleUrls: ['./menu-adminstrator.component.scss'],
})
export class MenuAdminstratorComponent {

 
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    }
}