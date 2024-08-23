// src/app/model/cep.ts
export interface Cep {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    complemento?: string;
    ddd?: string;
  }
  