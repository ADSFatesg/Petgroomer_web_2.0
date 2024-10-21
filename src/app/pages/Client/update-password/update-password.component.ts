import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validador personalizado para garantir que as senhas correspondem
  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Método para enviar o formulário de alteração de senha
  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      const {oldPassword, confirmPassword, newPassword } = this.passwordForm.value;

      this.authService.updatePassword(oldPassword,confirmPassword, newPassword).subscribe(
        () => {
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });
          this.passwordForm.reset();
          this.loading = false;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao alterar a senha. Tente novamente.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
          this.loading = false;
        }
      );
    }
  }
}
