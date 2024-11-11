// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeDTO, employeeRetrive } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://back-end.segredes.com.br/api/employee'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Create a new employee
  createEmployee(employeeDTO: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(this.apiUrl, employeeDTO).pipe(
      catchError(this.handleError)
    );
  }

  // Get all employees
  getEmployees(): Observable<employeeRetrive[]> {
    return this.http.get<employeeRetrive[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get a single employee by ID
  getEmployeeById(id:string): Observable<employeeRetrive> {
    return this.http.get<employeeRetrive>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get a single employee by CPF
  getEmployeeByCpf(cpf: string): Observable<employeeRetrive> {
    return this.http.get<employeeRetrive>(`${this.apiUrl}/findCpf/${cpf}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing employee
  updateEmployee(id:string, employeeDTO: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.apiUrl}/${id}`, employeeDTO).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an employee (usually soft delete by setting active to false)
  deleteEmployee(id:string): Observable<void> {
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
