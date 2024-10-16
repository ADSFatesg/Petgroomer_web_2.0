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
  private clientIdKey = 'clientId';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  login(login: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { login, password }).pipe(
      map(response => {
        const token = response.token;
        const roles = response.roles;
        const clientId = response.clientId;

        if (token) {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.roleKey, roles);
          localStorage.setItem(this.clientIdKey, clientId);
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

  getUserRoles(): string[] {
    const roles = localStorage.getItem(this.roleKey);
    return roles ? roles.split(',') : [];
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.clientIdKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
  getClientId(): string | null {
    return localStorage.getItem(this.clientIdKey);
  }

}
