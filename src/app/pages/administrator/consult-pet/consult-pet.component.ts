
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pet } from '../../../model/pet';
import { RacaPetENUM } from '../../../model/enum-racaPet';
import { PortePetENUM } from '../../../model/enum-portePet';

import { ClientService } from '../../../service/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../../service/pet.service';
import { Client } from '../../../model/client';

@Component({
  selector: 'app-consult-pet',
  templateUrl: './consult-pet.component.html',
  styleUrl: './consult-pet.component.scss'
})
export class ConsultPetComponent implements OnInit {
  petForm!: FormGroup;
  pets: Pet[] = [];
  selectedPet: Pet | null = null;
  ownerName: string = '';  // Nome do dono do pet
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
      cpf: ['', [Validators.required, Validators.pattern('\\d{11}')]],  // Valida CPF com 11 dígitos
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
      (client: Client) => {
        if (client && client.id) {
          this.ownerName = client.name; // Exibe o nome do dono

          this.petService.getPetsByClientId(client.id).subscribe(
            (pets: Pet[]) => {
              this.pets = pets;
              this.loading = false;
            },
            (error) => {
              this.snackBar.open('Erro ao buscar pets.', 'Fechar', {
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
        this.snackBar.open('Erro ao consultar cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.loading = false;
      }
    );
  }

  selecionarPet(pet: Pet): void {
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
      const updatedPet: Pet = {
        ...this.selectedPet,
        ...this.petForm.value

      };

      this.loading = true;

      this.petService.update(updatedPet.id!, updatedPet).subscribe(
        () => {
          this.snackBar.open('Pet atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });

          // Limpa o formulário, a seleção de pets e a lista de pets relacionados
          this.petForm.reset();
          this.selectedPet = null;
          this.pets = [];
          this.ownerName = ''; // Remove o nome do dono
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