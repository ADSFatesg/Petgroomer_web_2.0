
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RacaPetENUM } from '../../../model/enum-racaPet';
import { PortePetENUM } from '../../../model/enum-portePet';
import { ClientService } from '../../../service/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../../service/pet.service';
import { PetRetrive } from '../../../model/pet';
import { ClientRetrive } from '../../../model/client';

@Component({
  selector: 'app-consult-pet',
  templateUrl: './consult-pet.component.html',
  styleUrl: './consult-pet.component.scss'
})
export class ConsultPetComponent implements OnInit {
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.petForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern('\\d{11}')]], 
      name: ['', Validators.required],
      race: ['', Validators.required],
      size: ['', Validators.required],
      active: [false]
    });
  }

  consultarPets(): void {
    const cpf = this.petForm.get('cpf')?.value;

    if (!cpf || cpf.trim() === '') {
      this.snackBar.open('CPF não foi informado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.loading = true;

    this.clientService.findByCpf(cpf).subscribe(
      (client: ClientRetrive) => {
        if (client && client.id) {
          this.ownerName = client.name;

          this.petService.getPetsByClientId(client.id).subscribe(
            (pets: PetRetrive[]) => {
              this.pets = pets;
              this.loading = false;
            },
            (error) => {
              this.snackBar.open(error.message ||'Erro ao buscar pets.', 'Fechar', {
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
      const updatedPet: PetRetrive = {
        ...this.selectedPet,
        ...this.petForm.value

      };

      this.loading = true;

      this.petService.update(updatedPet.id, updatedPet).subscribe(
        () => {
          this.snackBar.open('Pet atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });

          this.petForm.reset();
          this.selectedPet = null;
          this.pets = [];
          this.ownerName = ''; 
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