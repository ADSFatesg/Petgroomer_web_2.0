import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../../service/client.service';
import { Client } from '../../../model/client';

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

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
       // Inicializa o formulário com os campos esperados
       this.clientForm = this.fb.group({
        name: [{ value: '', disabled: false }],
        email: [{ value: '', disabled: false }],
        phone: [{ value: '', disabled: false }],
        street: [{ value: '', disabled: false }],
        number: [{ value: '', disabled: false }],
        complement: [{ value: '', disabled: false }],
        neighborhood: [{ value: '', disabled: false }],
        city: [{ value: '', disabled: false }],
        state: [{ value: '', disabled: false }],
        country: [{ value: '', disabled: false }],
        postalCode: [{ value: '', disabled: false }],
        active: [{ value: '', disabled: false }],
        cpf:[{ value: '', disabled: true}]
      });
  }
  consultarCliente() {
    if (!this.cpf) {
      this.snackBar.open('CPF não foi informado.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.loading = true;
    this.clientService.findByCpf(this.cpf).subscribe(
      (cliente: Client) => {
        this.client = cliente;
        this.clientForm.patchValue({
          name: cliente.name,
          cpf:cliente.cpf,
          email: cliente.email,
          phone: cliente.phone,
          street: cliente.address.street,
          number: cliente.address.number,
          complement: cliente.address.complement,
          neighborhood: cliente.address.neighborhood,
          city: cliente.address.city,
          state: cliente.address.state,
          country: cliente.address.country,
          postalCode: cliente.address.postalCode,
          active: cliente.active ? 'Ativo' : 'Inativo'
        });
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Erro ao consultar cliente.', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
      }
    );
  }
}