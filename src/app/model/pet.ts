// pet.ts (model)

import { Client } from './client';
import { PortePetENUM } from './enum-portePet';
import { RacaPetENUM } from './enum-racaPet';

export interface Pet {
  id?: string;
  client: Client;
  name: string;
  race: RacaPetENUM;
  size: PortePetENUM;
  active: boolean;
}
