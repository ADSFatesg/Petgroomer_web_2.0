import { ClientService } from './../../../service/client.service';
import { ClientRetrive } from './../../../model/client';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RacaPetENUM } from '../../../model/enum-racaPet';
import { PortePetENUM } from '../../../model/enum-portePet';
import { PetService } from '../../../service/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetDTO } from '../../../model/pet';


@Component({
  selector: 'app-register-pet',
  templateUrl: './register-pet.component.html',
  styleUrl: './register-pet.component.scss'
})
export class RegisterPetComponent implements OnInit {
  petForm!: FormGroup;
  selectedClient: ClientRetrive | null = null;
  loading: boolean = false;
  races = Object.values(RacaPetENUM);
  sizes = Object.values(PortePetENUM);

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private snackBar: MatSnackBar,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.petForm = this.fb.group({
      cpf: ['', [Validators.required]],
      name: ['', [Validators.required]],
      race: ['', [Validators.required]],
      size: ['', [Validators.required]],
      active: [true, [Validators.required]],
      clientName: [{ value: '', disabled: true }]
    });
  }

  // Função para buscar cliente pelo CPF e preencher o formulário
  searchClientByCpf(): void {
    const cpf = this.petForm.get('cpf')?.value;

    if (!cpf) {
      this.snackBar.open('Por favor, insira um CPF válido.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.clientService.findByCpf(cpf).subscribe(
      (client: ClientRetrive) => {
        if (client) {
          if (!client.active) {
            this.snackBar.open('Cliente inativo. Não é possível cadastrar pet para este cliente.', 'Fechar', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snack-error']
            });
            this.selectedClient = null;
            this.petForm.patchValue({ clientName: '' });
            return;
          }

          this.selectedClient = client;
          this.petForm.patchValue({ clientName: client.name });

          this.snackBar.open('Cliente encontrado!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open('Cliente não encontrado.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.selectedClient = null;
        }
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao consultar cliente.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.selectedClient = null;
      }
    );
  }


  // Enviar o formulário para cadastrar o pet
  onSubmit(): void {
    if (this.petForm.valid && this.selectedClient) {
      this.loading = true;
      const petData: PetDTO = {
        ...this.petForm.value,
        client: this.selectedClient
      };

      this.petService.create(petData).subscribe(
        () => {
          this.snackBar.open('Pet cadastrado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
          this.petForm.reset();
        },
        (error) => {
          this.snackBar.open(error.message ||'Erro ao cadastrar o pet.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
        }
      );
    } else {
      this.snackBar.open('Preencha todos os campos e verifique o CPF.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
