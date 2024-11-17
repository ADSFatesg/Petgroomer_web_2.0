import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EnumCountry} from "../../../model/enum-country";
import {ClientService} from "../../../service/client.service";
import {CepService} from "../../../service/cep.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Cep} from "../../../model/cep";
import {ClientDTO} from "../../../model/client";
import {AddressDTO} from "../../../model/address";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarComponent implements OnInit {
  clientForm!: FormGroup;
  hidePassword = true;
  countries = Object.values(EnumCountry);

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private cepService: CepService,
    private snackBar: MatSnackBar,
    private router: Router
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
      country: ['', [Validators.required]],
      complement: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  consultarCEP(): void {
    const cepControl = this.clientForm.get('postalCode');
    if (cepControl && cepControl.valid) {
      const formattedCep = cepControl.value.replace('-', '').trim();
      this.cepService.getCepInfo(formattedCep).subscribe(
        (data: Cep) => {
          this.clientForm.patchValue({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          });
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao consultar o CEP.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.clientForm.patchValue({
            street: '',
            neighborhood: '',
            city: '',
            state: ''
          });
        }
      );
    } else {
      this.snackBar.open('CEP inválido. Por favor, digite um CEP válido.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const client: ClientDTO = {
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
        } as AddressDTO
      };

      this.clientService.create(client).subscribe(
        () => {
          this.snackBar.open('Cadastrado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.clientForm.reset();
          this.router.navigate(['/home']);
        },
        (error) => {
          this.snackBar.open(error.message ||'Erro ao cadastrar cliente.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else {
      this.snackBar.open('Por favor, corrija os erros do formulário.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
