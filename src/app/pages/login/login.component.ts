import { AuthService } from './../../authentication/auth.service';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  // Método para realizar o login
  loginUser() {
    this.authService.login(this.login, this.password).subscribe(
      success => {
        if (success) {
          const roles = this.authService.getUserRoles();
          console.log('Roles:', roles);

          // Redireciona para o papel prioritário
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/administrator']);
          } else if (roles.includes('ROLE_EMPLOYEE')) {
            this.router.navigate(['/funcionario']);
          } else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/client']);
          } else {
            // Caso nenhum papel correspondente seja encontrado
            console.error('Nenhum papel correspondente encontrado:', roles);
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
