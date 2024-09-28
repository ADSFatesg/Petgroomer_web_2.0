

import { ClientRetrive } from './client';
import { PortePetENUM } from './enum-portePet';
import { RacaPetENUM } from './enum-racaPet';

export interface PetDTO {
  client: EntityId;       
  name: string;           
  race: RacaPetENUM;      
  size: PortePetENUM;     
  active: boolean;     
}
export interface EntityId{
  id:string;
}
export interface PetRetrive {
  id:string;
  client: ClientRetrive;       
  name: string;           
  race: RacaPetENUM;      
  size: PortePetENUM;     
  active: boolean;     
}