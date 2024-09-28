
import { AddressRetrive } from "./address";
import { EnumPosition } from "./enum-position";

export interface EmployeeDTO {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: EntityId;
  wage: number;
  commission: number;
  position: EnumPosition;
  active: boolean;
}

export interface EntityId{
  id: string
}

export interface employeeRetrive{
  id:string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: AddressRetrive;
  wage: number;
  commission: number;
  position: EnumPosition;
  active: boolean;

}