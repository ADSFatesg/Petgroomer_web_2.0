import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../service/client.service";
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddressRetrive} from "../../../model/address";
import {EnumCountry} from "../../../model/enum-country";
import {CepService} from "../../../service/cep.service";
import {ClientRetrive} from "../../../model/client";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  userForm!: FormGroup;
  countries = Object.values(EnumCountry);
  loading = false;
  cpf!: string; // CPF carregado do cliente logado

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obter o ID do cliente logado
    const clientId = this.authService.getClientId();
    if (clientId) {
      this.loadClientData(clientId);
    }

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cpf: [{ value: '', disabled: true }, Validators.required], // Mantém o CPF desabilitado
      postalCode: ['', Validators.required],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: ['', Validators.required]
    });
  }

  // Método para carregar os dados do cliente logado
  loadClientData(clientId: string): void {
    this.clientService.findById(clientId).subscribe(
      (client: ClientRetrive) => {
        this.cpf = client.cpf; // Armazena o CPF para enviar na submissão
        this.userForm.patchValue({
          name: client.name,
          email: client.email,
          phone: client.phone,
          cpf: client.cpf, // Exibe o CPF desabilitado no campo
          postalCode: client.address.postalCode,
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement,
          neighborhood: client.address.neighborhood,
          city: client.address.city,
          state: client.address.state,
          country: client.address.country
        });
      },
      (error) => {
        this.snackBar.open('Erro ao carregar os dados do cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-error']
        });
      }
    );
  }

  // Método para salvar o cliente
  save(): void {
    if (this.userForm.valid) {
      const address = {
        postalCode: this.userForm.get('postalCode')!.value,
        street: this.userForm.get('street')!.value,
        number: this.userForm.get('number')!.value,
        complement: this.userForm.get('complement')!.value,
        neighborhood: this.userForm.get('neighborhood')!.value,
        city: this.userForm.get('city')!.value,
        state: this.userForm.get('state')!.value,
        country: this.userForm.get('country')!.value
      } as AddressRetrive;

      // Combina os dados do cliente e o endereço, incluindo o CPF
      const updatedClient = {
        ...this.userForm.value,
        cpf: this.cpf, // Inclui o CPF armazenado
        address
      };

      const clientId = this.authService.getClientId();
      if (clientId) {
        this.clientService.update(clientId, updatedClient).subscribe(
          () => {
            this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snack-success']
            });
          },
          (error) => {
            const errorMessage = error.message || 'Erro ao atualizar o cliente. Tente novamente.';
            this.snackBar.open(errorMessage, 'Fechar', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snack-error']
            });
          }
        );
      }
    } else {
      this.snackBar.open('Preencha todos os campos obrigatórios corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
    }
  }

  // Método para consultar o CEP e preencher o endereço automaticamente
  consultarCEP(): void {
    const cep = this.userForm.get('postalCode')?.value;
    if (cep) {
      this.cepService.getCepInfo(cep).subscribe(
        (data: any) => {
          if (data) {
            this.userForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              country: data.EnumCountry
            });
          }
        },
        (error) => {
          const errorMessage = error.message || 'Erro ao consultar o CEP. Verifique o valor informado.';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      );
    }
  }
}
