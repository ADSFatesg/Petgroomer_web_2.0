import { SchedulingDTO, SchedulingRetrieve } from './../model/scheduling';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StatusSchedulingEnum } from '../model/status-scheduling-enum';



@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private apiUrl = 'http://localhost:8080/api/scheduling';

  constructor(
    private http: HttpClient
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

  update(id: string, scheduling: SchedulingRetrieve): Observable<SchedulingRetrieve> {
    return this.http.put<SchedulingRetrieve>(`${this.apiUrl}/${id}`, scheduling).pipe(
      catchError((error) => this.handleError(error))
    );
  }
  updateStatus(id: string, status: StatusSchedulingEnum): Observable<any> {
    const statusUpdateRequest = { status }; 
  return this.http.put<SchedulingRetrieve>(`${this.apiUrl}/changestatus/${id}`, statusUpdateRequest).pipe(
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
