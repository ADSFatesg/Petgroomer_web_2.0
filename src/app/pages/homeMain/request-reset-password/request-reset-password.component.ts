import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.scss'
})
export class RequestResetPasswordComponent{
  requestForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.isLoading = true;
      this.authService.requestPasswordReset(this.requestForm.value.email).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Solicitação enviada com sucesso. Verifique seu e-mail para o link de redefinição.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });
          // Redirecionamento para a tela de redefinição de senha
          this.router.navigate(['reset-password/:token']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Erro ao solicitar redefinição: ' + err.message, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
}
