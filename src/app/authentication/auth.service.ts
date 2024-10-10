import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';
  private roleKey = 'userRole';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Método de login que envia login e senha
  login(login: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { login, password })
      .pipe(
        map(response => {
          const token = response.token;
          if (token) {
            this.setToken(token);
            localStorage.setItem(this.roleKey, response.roles);
            return true;
          }
          return false;
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = error.error.message || 'Erro ao fazer login. Tente novamente.';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top'
          });
          return throwError(() => error);
        })
      );
  }

  // Método para obter os papéis do usuário como um array
  getUserRoles(): string[] {
    const roles = localStorage.getItem(this.roleKey);
    const roleArray = roles ? roles.split(',') : [];
    return roleArray;
  }

  // Armazena o token no localStorage
  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtém o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove o token e os papéis (logout)
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
}
