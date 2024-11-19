import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PetRetrive} from "../../../model/pet";
import {RacaPetENUM} from "../../../model/enum-racaPet";
import {PortePetENUM} from "../../../model/enum-portePet";
import {ClientService} from "../../../service/client.service";
import {PetService} from "../../../service/pet.service";
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClientRetrive} from "../../../model/client";

@Component({
  selector: 'app-list-pet',
  templateUrl: './list-pet.component.html',
  styleUrl: './list-pet.component.scss'
})
export class ListPetComponent {
  petForm!: FormGroup;
  pets: PetRetrive[] = [];
  selectedPet: PetRetrive | null = null;
  ownerName: string = '';
  loading = false;
  races = Object.values(RacaPetENUM);
  sizes = Object.values(PortePetENUM);

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private petService: PetService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Inicializando o formulário sem o campo CPF
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      race: ['', Validators.required],
      size: ['', Validators.required],
      active: [false]
    });

    // Obtendo o ID do cliente autenticado
    const clientId = this.authService.getClientId();
    if (clientId) {
      this.loadClientPets(clientId);
    }
  }

  private loadClientPets(clientId: string): void {
    this.loading = true;

    this.clientService.findById(clientId).subscribe(
      (client: ClientRetrive) => {
        if (client && client.id) {
          this.ownerName = client.name;

          this.petService.getPetsByClientId(client.id).subscribe(
            (pets: PetRetrive[]) => {
              this.pets = pets;
              this.loading = false;
            },
            (error) => {
              this.snackBar.open(error.message || 'Nenhum Pet cadastrado.', 'Fechar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
              this.loading = false;
            }
          );
        }
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao consultar cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.loading = false;
      }
    );
  }

  selecionarPet(pet: PetRetrive): void {
    this.selectedPet = pet;
    this.petForm.patchValue({
      name: pet.name,
      race: pet.race,
      size: pet.size,
      active: pet.active
    });
  }

  atualizarPet(): void {
    if (this.selectedPet && this.petForm.valid) {
      this.loading = true;
      const updatedPet: PetRetrive = {
        ...this.selectedPet,
        ...this.petForm.value
      };
      this.petService.update(updatedPet.id, updatedPet).subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Pet atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });

          this.loading = false;
        },
        (error) => {
          this.snackBar.open('Erro ao atualizar o pet.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
        }
      );
    }
  }
}
