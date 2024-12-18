import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    }

    const expectedRole = route.data['role'];
    const userRoles = this.authService.getUserRoles();

    if (expectedRole && !userRoles.includes(expectedRole)) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
