import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Client } from '../model/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/api/client'; 

  constructor(private http: HttpClient) { }

  //Busca cliente pelo id
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // registra cliente
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError(this.handleError)
    );
  }
  // Função para lidar com erros
  private handleError(error: HttpErrorResponse) {
    // Aqui você pode personalizar a lógica de erro
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
    }
    // Repassar o erro para que possa ser tratado pelo componente
    return throwError(() => new Error(errorMessage));
  }

}
