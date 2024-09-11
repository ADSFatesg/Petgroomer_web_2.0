import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { response } from 'express';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  // Método de login que envia login e senha
  login(login: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { login, password })
      .pipe(
        map(response => {
          const token = response.token;
          if (token) {
            this.setToken(token);
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

  // Armazena o token no localStorage
  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtém o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove o token (logout)
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
}