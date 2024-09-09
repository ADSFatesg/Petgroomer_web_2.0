import { Address } from "./address";
import { EnumPosition } from "./enum-position";

export interface Employee {
    id?: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  wage: number;
  commission: number;
  position: EnumPosition;
  active: boolean;
}
