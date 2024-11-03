import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { token, newPassword, confirmPassword } = this.resetForm.value;
      if (newPassword !== confirmPassword) {
        this.snackBar.open('As senhas não coincidem.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }

      this.isLoading = true;
      this.authService.resetPassword(token, newPassword, confirmPassword).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Senha redefinida com sucesso.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao redefinir senha: ' + err.message, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
