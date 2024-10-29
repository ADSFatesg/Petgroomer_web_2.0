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
  private apiUrl = 'http://localhost:8080/auth';
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
      catchError(this.handleError.bind(this)) // Tratamento de erro
    );
  }

  // Método para atualizar a senha
  updatePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<void> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Token no cabeçalho
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
      catchError(this.handleError.bind(this)) // Tratamento de erro
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

  // Método para listar todos os usuários (agora com tipagem User[])
  findAllUsers(): Observable<User[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/admin/findall`, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // AuthService
  adminUpdatePassword(userId: string, oldPassword: string, newPassword: string, confirmPassword: string): Observable<void> {
    const payload = { oldPassword, newPassword, confirmPassword }; // Inclui oldPassword no payload

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}` // Inclui o token de autorização, se necessário
    });

    return this.http.post<void>(`${this.apiUrl}/admin/update-password/${userId}`, payload, { headers });
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
