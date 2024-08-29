import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../../service/client.service';
import { Client } from '../../../model/client';
import { EnumCountry } from '../../../model/enum-country';
import { CepService } from '../../../service/cep.service';
import { Cep } from '../../../model/cep';

@Component({
  selector: 'app-consult-client',
  templateUrl: './consult-client.component.html',
  styleUrls: ['./consult-client.component.scss']
})
export class ConsultClientComponent implements OnInit{
  cpf: string = '';
  clientForm!: FormGroup;
  loading: boolean = false;
  client: Client | null = null;
  clientId: number | null = null; // Store the client ID here
  countries = Object.values(EnumCountry);

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private cepService: CepService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern('\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}')]],  // Verifique se a máscara ou padrão está correto
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      postalCode: ['', Validators.required],
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      country: ['', Validators.required],
      active: [false]
    });
  }
  consultarCEP(): void {
    const cep = this.clientForm.get('postalCode')?.value;
    if (cep) {
      this.cepService.getCepInfo(cep).subscribe(
        (data: Cep) => {
          if (data) {
            this.clientForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            });
          }
        },
        (error) => {
          this.snackBar.open('Erro ao consultar CEP.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, insira um CEP válido.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
  consultarCliente() {
    const cpf = this.clientForm.get('cpf')?.value;
  
    if (!cpf || cpf.trim() === '') {
      this.snackBar.open('CPF não foi informado.', 'Fechar', {
        duration: 3000,
      });
      return;
    }
  
    this.loading = true;
  
    this.clientService.findByCpf(cpf).subscribe(
      (cliente: Client) => {
        this.loading = false;
  
        if (cliente) {
          // Armazena o cliente encontrado para posterior atualização
          this.client = cliente;
          this.clientId = cliente.id;
  
          // Atualiza o formulário com os dados do cliente
          this.clientForm.patchValue({
            cpf: cliente.cpf,
            name: cliente.name,
            email: cliente.email,
            phone: cliente.phone,
            postalCode: cliente.address.postalCode,
            street: cliente.address.street,
            number: cliente.address.number,
            complement: cliente.address.complement,
            neighborhood: cliente.address.neighborhood,
            city: cliente.address.city,
            state: cliente.address.state,
            country: cliente.address.country,
            active: cliente.active
          });
        } else {
          this.snackBar.open('Cliente não encontrado.', 'Fechar', {
            duration: 3000,
          });
        }
      },
      (error) => {
        this.loading = false;
        this.snackBar.open(error.message || 'Erro ao consultar cliente.', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }
  
  
  atualizarCliente() {
    // Verifica se o cliente foi carregado corretamente
    if (this.client && this.clientId !== null) {
      const updatedClient: Client = {
        ...this.client,  // Mantém os dados existentes do cliente
        ...this.clientForm.getRawValue(),  // Sobrescreve com os novos valores do formulário
      };
  
      this.loading = true;
  
      this.clientService.update(this.clientId, updatedClient).subscribe(
        (cliente: Client) => {
          this.snackBar.open('Cliente atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
  
          // Atualiza o formulário com os dados atualizados do cliente
          this.client = cliente; 
          this.clientForm.patchValue(cliente);
          this.loading = false;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar cliente.', 'Fechar', {
            duration: 3000,
          });
          this.loading = false;
        }
      );
    } else {
      // Caso o cliente não tenha sido carregado, exibe uma mensagem de erro
      this.snackBar.open('Nenhum cliente foi carregado.', 'Fechar', {
        duration: 3000,
      });
    }
  }
}  