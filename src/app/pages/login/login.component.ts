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
  ) {}

  // Método para realizar o login
  loginUser() {
    this.authService.login(this.login, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/administrator']);
        }
      }
    );
  }
}