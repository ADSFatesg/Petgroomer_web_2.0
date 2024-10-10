import { Component } from '@angular/core';
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-client',
  templateUrl: './menu-client.component.html',
  styleUrl: './menu-client.component.scss'
})
export class MenuClientComponent {
    constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
