import { Employee } from "./employee";

export interface Service {
    id: string;
    name: string;
    price: number;
    estimated: number; 
    commission: number;
    active: boolean;
    employee: Employee;
}
