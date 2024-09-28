import { AddressRetrive } from './address';

export interface ClientDTO {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: EntityId;
  active: boolean;
}

export interface EntityId{
  id:String;
}

export interface ClientRetrive{
  id: string
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: AddressRetrive;
  active: boolean;
}