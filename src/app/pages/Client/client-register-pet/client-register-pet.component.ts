import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientRetrive} from "../../../model/client";
import {RacaPetENUM} from "../../../model/enum-racaPet";
import {PortePetENUM} from "../../../model/enum-portePet";
import {PetService} from "../../../service/pet.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClientService} from "../../../service/client.service";
import {AuthService} from "../../../authentication/auth.service";
import {PetDTO} from "../../../model/pet";

@Component({
  selector: 'app-client-register-pet',
  templateUrl: './client-register-pet.component.html',
  styleUrl: './client-register-pet.component.scss'
})
export class ClientRegisterPetComponent implements OnInit{
  petForm!: FormGroup;
  selectedClient: ClientRetrive | null = null;
  races = Object.values(RacaPetENUM);
  sizes = Object.values(PortePetENUM);
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private snackBar: MatSnackBar,
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário sem o campo CPF
    this.petForm = this.fb.group({
      name: ['', [Validators.required]],
      race: ['', [Validators.required]],
      size: ['', [Validators.required]],
      active: [true, [Validators.required]]
    });

    // Obtém o ID do cliente logado
    const clientId = this.authService.getClientId();
    if (clientId) {
      this.loadClientData(clientId);
    }
  }

  private loadClientData(clientId: string): void {
    // Busca os dados do cliente autenticado
    this.clientService.findById(clientId).subscribe(
      (client: ClientRetrive) => {
        this.selectedClient = client;
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao carregar dados do cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Enviar o formulário para cadastrar o pet
  onSubmit(): void {
    if (this.petForm.valid && this.selectedClient) {
      this.loading = true;
      const petData: PetDTO = {
        ...this.petForm.value,
        client: this.selectedClient  // Associa o cliente autenticado ao pet
      };

      this.petService.create(petData).subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Pet cadastrado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.petForm.reset();  // Reseta o formulário após o cadastro
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao cadastrar o pet.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
