import { Address } from './address';

export interface Client {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  active: boolean;
}
