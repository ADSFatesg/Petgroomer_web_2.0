export interface AddressDTO {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
  export interface AddressRetrive{
    id:string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }