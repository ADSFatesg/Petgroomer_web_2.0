// src/app/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ClientDTO, ClientRetrive } from '../model/client';



@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:8080/api/client';

  constructor(private http: HttpClient ) {}

  create(client: ClientDTO): Observable<ClientDTO> {
    return this.http.post<ClientDTO>(this.apiUrl, client).pipe(
      catchError(this.handleError)
    );
  }

  findAll(): Observable<ClientRetrive[]> {
    return this.http.get<ClientRetrive[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  findById(id: string): Observable<ClientRetrive> {
    return this.http.get<ClientRetrive>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  findByCpf(cpf: string): Observable<ClientRetrive> {
    return this.http.get<ClientRetrive>(`${this.apiUrl}/findCpf/${cpf}`).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, client: ClientDTO): Observable<ClientDTO> {
    return this.http.put<ClientDTO>(`${this.apiUrl}/${id}`, client).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return throwError(() => new Error(`Erro: ${error.error.message}`));
    } else {
      // Server-side error 
      let errorMessage = 'Ocorreu um erro inesperado.';
  
      if (error.status === 400 && error.error && error.error.errors) { 
        // Trata erros de validação 
        const validationErrors = error.error.errors.map((err: any) => err.error); 
        errorMessage = `Erro de validação: ${validationErrors.join(', ')}`;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } 
  
      return throwError(() => new Error(errorMessage));
    }
  }
}