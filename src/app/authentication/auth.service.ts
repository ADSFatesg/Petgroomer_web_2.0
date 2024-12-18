import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {User} from "../model/user";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://back-end.segredes.com.br/auth';
  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private clientIdKey = 'clientId';
  private employeeKey = 'employeeId';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Método de login
  login(login: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { login, password }).pipe(
      map(response => {
        const token = response.token;


        if (token) {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.roleKey, response.roles);
          localStorage.setItem(this.clientIdKey,response.clientId);
          localStorage.setItem(this.employeeKey,response.employeeId)
          return true;
        }
        return false;
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Método para atualizar a senha
  updatePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<void> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = { oldPassword, newPassword, confirmPassword };

    return this.http.post<void>(`${this.apiUrl}/update-password`, payload, { headers }).pipe(
      map(() => {
        this.snackBar.open('Senha atualizada com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-success']
        });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Método para fazer logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.clientIdKey);
    localStorage.removeItem(this.employeeKey)
    this.snackBar.open('Você foi desconectado.', 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snack-success']
    });
  }

  // Método para obter o token do usuário
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Método para obter o ID do cliente logado
  getClientId(): string | null {
    return localStorage.getItem(this.clientIdKey);
  }
  getEmployeeId(): string | null {
    return localStorage.getItem(this.employeeKey);
  }
  // Método para obter as roles do usuário
  getUserRoles(): string[] {
    const roles = localStorage.getItem(this.roleKey);
    return roles ? roles.split(',') : [];
  }

  // Método para listar todos os usuários
  findAllUsers(): Observable<User[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/admin/findall`, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }


  admResetPasswordEmployee(cpf: string, newPassword: string, confirmPassword: string): Observable<any> {
    const payload = { newPassword, confirmPassword };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<any>(`${this.apiUrl}/adm-reset-password/${cpf}`, payload, { headers });
  }

  // Método para solicitar a redefinição de senha
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request-reset-password/${email}`, null).pipe(
      map(() => {
        this.snackBar.open('Solicitação de redefinição de senha enviada. Verifique seu e-mail.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-success']
        });
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Método para redefinir a senha usando o token
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<void> {
    const payload = { newPassword, confirmPassword };
    return this.http.post<void>(`${this.apiUrl}/reset-password/${token}`, payload).pipe(
      map(() => {
        this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-success']
        });
      }),
      catchError(this.handleError.bind(this))
    );
  }


  // Tratamento de erros da API
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro inesperado.';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      if (error.status === 400 && error.error && error.error.errors) {
        // Erros de validação
        const validationErrors = error.error.errors.map((err: any) => err.error);
        errorMessage = `Erro de validação: ${validationErrors.join(', ')}`;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    // Exibe o erro via MatSnackBar
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snack-error']
    });

    return throwError(() => new Error(errorMessage));
  }
}
