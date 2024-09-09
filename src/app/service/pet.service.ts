import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from '../model/pet';
import { catchError, Observable, throwError } from 'rxjs';
import { Client } from '../model/client';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8080/api/pet';

  constructor(private http: HttpClient) { }

  create(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet).pipe(
      catchError(this.handleError)
    )
  }
  findAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    )
  }
  findById(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    )
  }
  update(id: string, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet).pipe(
      catchError(this.handleError)
    )
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

getPetsByClientId(clientId: string): Observable<Pet[]> {
  return this.http.get<Pet[]>(`${this.apiUrl}/client/${clientId}`).pipe(
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
