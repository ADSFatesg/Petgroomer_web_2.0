import { Service } from './../model/service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private urlApi = 'http://localhost:8080/api/service'

  constructor(private http: HttpClient) { }

  create(service: Service): Observable<Service> {
    return this.http.post<Service>(this.urlApi, service).pipe(
      catchError(this.handleError)
    );
  }
  findAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.urlApi).pipe(
      catchError(this.handleError)
    );
  }
  findById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.urlApi}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  update(id: string, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.urlApi}/${id}`, service).pipe(
      catchError(this.handleError)
    );
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`).pipe(
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
