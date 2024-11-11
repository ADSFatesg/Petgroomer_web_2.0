import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PetDTO, PetRetrive } from '../model/pet';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'https://back-end.segredes.com.br/api/pet';

  constructor(private http: HttpClient) { }

  create(pet: PetDTO): Observable<PetDTO> {
    return this.http.post<PetDTO>(this.apiUrl, pet).pipe(
      catchError(this.handleError)
    )
  }
  findAll(): Observable<PetRetrive[]> {
    return this.http.get<PetRetrive[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    )
  }
  findById(id: string): Observable<PetRetrive> {
    return this.http.get<PetRetrive>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    )
  }
  update(id: string, pet: PetDTO): Observable<PetDTO> {
    return this.http.put<PetDTO>(`${this.apiUrl}/${id}`, pet).pipe(
      catchError(this.handleError)
    )
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

getPetsByClientId(clientId: string): Observable<PetRetrive[]> {
  return this.http.get<PetRetrive[]>(`${this.apiUrl}/client/${clientId}`).pipe(
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
