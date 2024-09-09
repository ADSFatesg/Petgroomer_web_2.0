import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnumPosition } from '../../../model/enum-position';
import { Employee } from '../../../model/employee';
import { Address } from '../../../model/address';
import { EnumCountry } from '../../../model/enum-country';
import { CepService } from '../../../service/cep.service';
import { Cep } from '../../../model/cep';

@Component({
  selector: 'app-consult-employee',
  templateUrl: './consult-employee.component.html',
  styleUrl: './consult-employee.component.scss'
})
export class ConsultEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  employeeId:string = "";
  positions = Object.values(EnumPosition);  // Array com os cargos disponíveis
  countries = Object.values(EnumCountry);   // Array com os países disponíveis

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private cepService: CepService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      cpf: ['', [Validators.required]],  // Validador padrão
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
      position: ['', [Validators.required]],
      commission: ['', [Validators.required]],
      wage: ['', [Validators.required]],
      active: [true]
    });
  }

  consultarCEP(): void {
    const cep = this.employeeForm.get('postalCode')?.value;
    if (cep) {
      this.cepService.getCepInfo(cep).subscribe(
        (data: Cep) => {
          if (data) {
            this.employeeForm.patchValue({
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

  consultarFuncionario(): void {
    this.loading = true;
    const cpf = this.employeeForm.get('cpf')?.value.replace(/\D/g, ''); // Remove a máscara antes de consultar
    if (cpf) {
      this.employeeService.getEmployeeByCpf(cpf).subscribe(
        (employee: Employee) => {
          this.employeeId = employee.id || '';
          this.employeeForm.patchValue({
            cpf: employee.cpf,
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            postalCode: employee.address.postalCode,
            street: employee.address.street,
            number: employee.address.number,
            neighborhood: employee.address.neighborhood,
            city: employee.address.city,
            state: employee.address.state,
            country: employee.address.country || '',
            complement: employee.address.complement,
            position: employee.position || '',
            commission: employee.commission,
            wage: employee.wage,
            active: employee.active
          });
          
          this.loading = false;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao consultar funcionário.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          
          this.loading = false;
        }
      );
    } else {
      this.snackBar.open('Por favor, insira um CPF válido.', 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.loading = false;
    }
  }

  atualizarFuncionario(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const employeeDTO: Employee = {
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
        } as Address,
        position: this.employeeForm.get('position')!.value
      };

      this.employeeService.updateEmployee(this.employeeId, employeeDTO).subscribe(
        () => {
          this.snackBar.open('Funcionário atualizado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.employeeForm.reset();
          this.loading = false;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar funcionário.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
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