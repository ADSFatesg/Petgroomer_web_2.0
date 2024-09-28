import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumCountry } from '../../../model/enum-country';
import { EnumPosition } from '../../../model/enum-position';
import { EmployeeService } from '../../../service/employee.service';
import { CepService } from '../../../service/cep.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cep } from '../../../model/cep';
import { EmployeeDTO } from '../../../model/employee';
import { AddressDTO } from '../../../model/address';


@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.scss'
})
export class RegisterEmployeeComponent implements OnInit{
  employeeForm!: FormGroup;
  loading = false;
  countries = Object.values(EnumCountry);
  positions = Object.values(EnumPosition);
  hidePassword  = true;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cepService: CepService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
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
      country: ['', Validators.required],
      complement: [''],
      wage: ['', [Validators.required]],
      commission: [''],
      position: ['', [Validators.required]],
      active: [true],
      password:['',[Validators.required, Validators.minLength(6)]]
    });
  }

  consultarCEP() {
    const cepControl = this.employeeForm.get('postalCode');
    if (cepControl && cepControl.valid) {
      const formattedCep = cepControl.value.replace('-', '').trim();
      this.cepService.getCepInfo(formattedCep).subscribe(
        (data: Cep) => {
          this.employeeForm.patchValue({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            number: this.employeeForm.get('number')?.value || '',
          });
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao consultar o CEP.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.employeeForm.patchValue({
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
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
    if (this.employeeForm.valid) {
      this.loading = true;
      const employee: EmployeeDTO = {
        ...this.employeeForm.value,
        address: {
          street: this.employeeForm.get('street')!.value,
          number: this.employeeForm.get('number')!.value,
          complement: this.employeeForm.get('complement')!.value,
          neighborhood: this.employeeForm.get('neighborhood')!.value,
          city: this.employeeForm.get('city')!.value,
          state: this.employeeForm.get('state')!.value,
          country: this.employeeForm.get('country')!.value,
          postalCode: this.employeeForm.get('postalCode')!.value
        } as AddressDTO
      };

      this.employeeService.createEmployee(employee).subscribe(
        () => {
          this.loading = false;
          this.snackBar.open('Funcionário criado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.employeeForm.reset(); 
        },
        (error) => {
          this.loading = false;
          this.snackBar.open(error.message || 'Erro ao criar funcionário.', 'Fechar', {
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

