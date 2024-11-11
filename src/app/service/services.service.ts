
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ServiceDTO, ServiceRetrieve } from '../model/service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private urlApi = 'https://back-end.segredes.com.br/api/service'

  constructor(private http: HttpClient) { }

  create(service: ServiceDTO): Observable<ServiceDTO> {
    return this.http.post<ServiceDTO>(this.urlApi, service).pipe(
      catchError(this.handleError)
    );
  }
  findAll(): Observable<ServiceRetrieve[]> {
    return this.http.get<ServiceRetrieve[]>(this.urlApi).pipe(
      catchError(this.handleError)
    );
  }
  findById(id: string): Observable<ServiceRetrieve> {
    return this.http.get<ServiceRetrieve>(`${this.urlApi}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  update(id: string, service: ServiceRetrieve): Observable<ServiceRetrieve> {
    return this.http.put<ServiceRetrieve>(`${this.urlApi}/${id}`, service).pipe(
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
