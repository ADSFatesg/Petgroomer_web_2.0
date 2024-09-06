// pet.ts (model)

import { Client } from './client';
import { PortePetENUM } from './enum-portePet';
import { RacaPetENUM } from './enum-racaPet';

export interface Pet {
  id?: string;
  client: Client; // Cliente proprietário do pet
  name: string;
  race: RacaPetENUM;
  size: PortePetENUM;
  isActive: boolean;
}
