import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Cep } from './../../../model/cep';
import { CepService } from './../../../service/cep.service';
import { ClientService } from '../../../service/client.service';
import { Client } from '../../../model/client';
import { Address } from '../../../model/address';
import { EnumCountry } from '../../../model/enum-country';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit {
  clientForm!: FormGroup;
  hide = true;

  countries = Object.values(EnumCountry);

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private cepService: CepService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      cpf: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      street: [''],
      number: ['', [Validators.required]],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: [''], // Certifique-se de que o campo 'country' esteja no FormGroup
      complement: [''],
      active: [true],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  consultarCEP() {
    const cepControl = this.clientForm.get('postalCode');
    if (cepControl && cepControl.valid) {
      const formattedCep = cepControl.value.replace('-', '').trim();
      this.cepService.getCepInfo(formattedCep).subscribe({
        next: (data: Cep) => {
          this.clientForm.patchValue({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            number: this.clientForm.get('number')?.value || '',
    
          });
        },
        error: err => {
          this.snackBar.open('Erro ao consultar o CEP.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.clientForm.patchValue({
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            // country: '' // Não limpar o país em caso de erro
          });
        }
      });
    } else {
      this.snackBar.open('CEP inválido. Por favor, digite um CEP válido.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const client: Client = {
        ...this.clientForm.value,
        address: {
          street: this.clientForm.get('street')!.value,
          number: this.clientForm.get('number')!.value,
          complement: this.clientForm.get('complement')!.value,
          neighborhood: this.clientForm.get('neighborhood')!.value,
          city: this.clientForm.get('city')!.value,
          state: this.clientForm.get('state')!.value,
          country: this.clientForm.get('country')!.value, // Usar o valor do FormGroup para o país
          postalCode: this.clientForm.get('postalCode')!.value
        } as Address
      };
      this.clientService.create(client).subscribe({
        next: () => {
          this.snackBar.open('Cliente criado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.clientForm.reset(); 
        },
      });
    } else {
      this.snackBar.open('Por favor, corrija os erros do formulário.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}