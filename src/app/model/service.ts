import {employeeRetrive } from "./employee";

export interface ServiceDTO {
    employee: EntityId; 
    name: string;
    price: number; 
    estimated: number;
    commission: number; 
    active: boolean; 
}
export interface EntityId {
    id: string; 
}
export interface ServiceRetrieve {
    id: string;
    employee: employeeRetrive; 
    name: string;
    price: number; 
    estimated: number;
    commission: number;
    active: boolean;
}