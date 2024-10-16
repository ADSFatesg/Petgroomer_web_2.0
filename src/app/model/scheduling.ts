import { PaymentMethodEnum } from "./payment-method-enum";
import { PetRetrive } from "./pet";
import { ServiceRetrieve } from "./service";
import { StatusSchedulingEnum } from "./status-scheduling-enum";


// Definição da interface DTO
export interface SchedulingDTO {
    pet: EntityId;
    service: EntityId[];
    date: Date;
    time: string;
    observations?: string;
    paymentMethod: PaymentMethodEnum;
    statusScheduling: StatusSchedulingEnum;
}


export interface EntityId {
    id: string;
}


// Definição da interface SchedulingRetrieve
export interface SchedulingRetrieve {
    id: string;
    pet: PetRetrive[];
    service: ServiceRetrieve[];
    date: Date;
    time: string;
    observations?: string;
    totalValue: number;
    paymentMethod: PaymentMethodEnum;
    statusScheduling: StatusSchedulingEnum;
}
