
import { Cep } from './../../../model/cep';
import { CepService } from './../../../service/cep.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../service/client.service';
import { Client } from '../../../model/client';
import { Address } from '../../../model/address';

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
    private cepService: CepService
  ) {
    this.clientForm = this.fb.group({
      cpf: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      postalCode: ['', Validators.required],
      street: [''],
      number: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: [''],
      complement: [''], // Adicione o campo complement
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
              console.log('Dados retornados pela API:', data);
              // Atualiza apenas os campos de endereço com as informações do CEP
              this.clientForm.patchValue({
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
                postalCode: data.cep,
                // Mantém o campo 'number' vazio para ser preenchido pelo usuário
                number: this.clientForm.get('number')?.value || '',
                country: this.clientForm.get('country')?.value || '', // Defina um valor padrão se necessário
              });
            },
            error: err => {
              console.error('Erro ao consultar o CEP:', err);
              // Limpa os campos de endereço no formulário se houver erro
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
      this.clientService.createClient(client).subscribe(
        response => {
          console.log('Cliente criado com sucesso', response);
        },
        error => {
          console.error('Erro ao criar cliente', error);
        }
      );
    }
  }
}