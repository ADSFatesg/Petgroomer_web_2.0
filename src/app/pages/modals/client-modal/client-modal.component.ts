
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../../../service/cep.service';
import { EnumCountry } from '../../../model/enum-country';
import { ClientService } from '../../../service/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientRetrive } from '../../../model/client';
import { AddressDTO, AddressRetrive } from '../../../model/address';

@Component({
  selector: 'app-client-modal',
  templateUrl:'./client-modal.component.html',
  styleUrl: './client-modal.component.scss'
})
export class ClientModalComponent {
  clientForm!: FormGroup;
  countries = Object.values(EnumCountry);

  constructor(
    public dialogRef: MatDialogRef<ClientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: ClientRetrive },
    private fb: FormBuilder,
    private cepService: CepService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: [this.data.client.name, Validators.required],
      email: [this.data.client.email, [Validators.required, Validators.email]],
      phone: [this.data.client.phone, Validators.required],
      cpf: [{ value: this.data.client.cpf, disabled: true }, Validators.required],
      
      // Campos de endereço separados
      postalCode: [this.data.client.address.postalCode, Validators.required],
      street: [this.data.client.address.street],
      number: [this.data.client.address.number],
      complement: [this.data.client.address.complement],
      neighborhood: [this.data.client.address.neighborhood],
      city: [this.data.client.address.city],
      state: [this.data.client.address.state],
      country: [this.data.client.address.country, Validators.required]
    });
  }

  // Método para salvar o cliente
  save(): void {
    if (this.clientForm.valid) {
      const address = {
        postalCode: this.clientForm.get('postalCode')!.value,
        street: this.clientForm.get('street')!.value,
        number: this.clientForm.get('number')!.value,
        complement: this.clientForm.get('complement')!.value,
        neighborhood: this.clientForm.get('neighborhood')!.value,
        city: this.clientForm.get('city')!.value,
        state: this.clientForm.get('state')!.value,
        country: this.clientForm.get('country')!.value
      } as AddressRetrive

      // Combina os dados do cliente e o endereço
      const updatedClient = { 
        ...this.data.client, 
        address
      };

      // Chama o método update da API através do clientService
      this.clientService.update(updatedClient.id, updatedClient).subscribe(
        () => {
          // Exibe a notificação de sucesso
          this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });

          // Fecha o modal e envia os dados atualizados de volta
          this.dialogRef.close(updatedClient);
        },
        (error) => {
          // Captura a mensagem de erro da API e exibe no snackBar
          const errorMessage = error.message || 'Erro ao atualizar o cliente. Tente novamente.';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      );
    } else {
      // Se o formulário for inválido, exibe um erro
      this.snackBar.open('Preencha todos os campos obrigatórios corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
    }
  }

  // Método para fechar o modal sem salvar
  close(): void {
    this.dialogRef.close();
  }

  // Método para consultar o CEP e preencher o endereço automaticamente
  consultarCEP(): void {
    const cep = this.clientForm.get('postalCode')?.value;

    if (cep) {
      this.cepService.getCepInfo(cep).subscribe(
        (data: any) => {
          if (data) {
            this.clientForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
              country: data.EnumCountry
            });

            // Exibe mensagem de sucesso ao buscar o CEP
            this.snackBar.open('Endereço atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snack-success']
            });
          }
        },
        (error) => {
          // Captura a mensagem de erro da API e exibe no snackBar
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