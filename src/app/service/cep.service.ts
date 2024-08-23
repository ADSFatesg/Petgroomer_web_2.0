// src/app/service/cep.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cep } from '../model/cep';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private apiUrl = 'https://viacep.com.br/ws'; // URL da API ViaCEP

  constructor(private http: HttpClient) { }

  getCepInfo(cep: string): Observable<Cep> {
    const url = `${this.apiUrl}/${cep}/json/`; // Endpoint da API ViaCEP
    return this.http.get<Cep>(url);
  }
}
