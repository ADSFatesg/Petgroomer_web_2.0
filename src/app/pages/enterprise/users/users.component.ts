import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  allUsers: { id: any; login: any; employeeName: any; employeeId: any }[] = [];
  usersWithEmployee: { id: any; login: any; employeeName: any }[] = [];
  selectedUser: { id: any; login: any; employeeName: any } | null = null;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Método para carregar a lista de usuários e extrair apenas os campos necessários
  loadUsers(): void {
    this.loading = true;
    this.authService.findAllUsers().subscribe(
      (usersData: any[]) => {
        this.allUsers = usersData.map(user => ({
          id: user.id,
          login: user.login,
          employeeId: user.employee ? user.employee.id : null,
          employeeName: user.employee ? user.employee.name : 'N/A'
        }));
        this.usersWithEmployee = this.allUsers.filter(user => user.employeeId);
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-error']
        });
        this.loading = false; // Desativa o spinner em caso de erro
      }
    );
  }

  // Método para atualizar a senha do usuário selecionado
  updatePassword(): void {
    // Validação dos campos
    if (this.oldPassword.length === 0) {
      this.snackBar.open('A senha atual é obrigatória!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      return;
    }

    if (this.newPassword.length < 6) {
      this.snackBar.open('A nova senha deve ter pelo menos 6 caracteres!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('As senhas não coincidem!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      return;
    }

    if (this.selectedUser) {
      this.loading = true;
      this.authService.adminUpdatePassword(this.selectedUser.id, this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
        () => {
          this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });
          this.resetForm();
          this.loading = false;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao alterar senha!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
          this.loading = false;
        }
      );
    }
  }

  // Método para resetar o formulário de senha
  resetForm(): void {
    this.selectedUser = null;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Método para selecionar um usuário e abrir o formulário de alteração de senha
  selectUser(userId: string): void {
    this.selectedUser = this.usersWithEmployee.find(user => user.id === userId) || null;
  }
}
