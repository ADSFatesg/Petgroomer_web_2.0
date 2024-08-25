import { Address } from './address';

export interface Client {
  id: number;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  active: boolean;
  password:string;
}
