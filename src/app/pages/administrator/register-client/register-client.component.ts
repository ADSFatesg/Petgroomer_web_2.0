
import { Cep } from './../../../model/cep';
import { CepService } from './../../../service/cep.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../service/client.service';
import { Client } from '../../../model/client';
import { Address } from '../../../model/address';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.scss'
})
export class RegisterClientComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private cepService: CepService,
    private snackBar: MatSnackBar
  ) {
    this.clientForm = this.fb.group({
      cpf: [''],
      name: [''],
      email: [''],
      phone: [''],
      postalCode: [''],
      street: [''],
      number: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: [''],
      complement: [''],
      active: [true],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.clientForm.get('postalCode')!.valueChanges.subscribe(
      postalCode => {
        const formattedCep = postalCode.replace('-', '').trim();
        if (formattedCep.length === 8) {
          this.cepService.getCepInfo(formattedCep).subscribe({
            next: (data: Cep) => {
              this.clientForm.patchValue({
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
                postalCode: data.cep,
                number: this.clientForm.get('number')?.value || '',
                country: this.clientForm.get('country')?.value || '',
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
                postalCode: '',
                country: ''
              });
            }
          });
        }
      }
    );
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
          country: this.clientForm.get('country')!.value,
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