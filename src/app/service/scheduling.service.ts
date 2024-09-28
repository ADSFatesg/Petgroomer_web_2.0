import { SchedulingDTO, SchedulingRetrieve } from './../model/scheduling';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private apiUrl = 'http://localhost:8080/api/scheduling';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

 
  create(scheduling: SchedulingDTO): Observable<SchedulingDTO> {
    return this.http.post<SchedulingDTO>(this.apiUrl, scheduling).pipe(
      catchError((error) => this.handleError(error))
    );
  }


  findAll(): Observable<SchedulingRetrieve[]> {
    return this.http.get<SchedulingRetrieve[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  findById(id: string): Observable<SchedulingRetrieve> {
    return this.http.get<SchedulingRetrieve>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  update(id: string, scheduling: SchedulingDTO): Observable<SchedulingDTO> {
    return this.http.put<SchedulingDTO>(`${this.apiUrl}/${id}`, scheduling).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error(`Erro: ${error.error.message}`));
    } else {
      let errorMessage = 'Ocorreu um erro inesperado.';
      
      if (error.status === 400 && error.error && error.error.errors) {
        const validationErrors = error.error.errors.map((err: any) => err.error);
        errorMessage = `Erro de validação: ${validationErrors.join(', ')}`;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }

      return throwError(() => new Error(errorMessage));
    }
  }
}
