import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = 'Ocorreu um erro inesperado.';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Erro: ${error.error.message}`;
        } else if (error.status === 400 && error.error && error.error.errors) {
          // Trata erros de validação 
          // Itera sobre o array de erros e exibe cada mensagem em um snack-bar
          error.error.errors.forEach((errorItem: any) => {
            this.snackBar.open(errorItem.error, 'Fechar', {
              duration: 5000,
              verticalPosition: 'top'
            });
          });
        } else if (error.error && error.error.message) {
          // Extrai a mensagem diretamente do erro, se disponível
          errorMessage = error.error.message;
        }

        // Exibe a mensagem geral ou específica, se houver
        if (errorMessage !== 'Ocorreu um erro inesperado.') { 
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }

        return throwError(() => error); 
      })
    );
  }
}