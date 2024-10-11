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
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  loginUser() {
    this.authService.login(this.login, this.password).subscribe(
      success => {
        if (success) {
          const roles = this.authService.getUserRoles();

          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/administrator']);
          } else if (roles.includes('ROLE_EMPLOYEE')) {
            this.router.navigate(['/employee']);
          } else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/client']);
          } else {
            this.snackBar.open('Nenhuma role encontrada. Entre em contato com o administrador.', 'Fechar', {
              duration: 5000,
              verticalPosition: 'top'
            });
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      },
      error => {
        console.error('Login falhou', error);
        this.snackBar.open('Erro ao realizar login. Verifique suas credenciais.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    );
  }
}
