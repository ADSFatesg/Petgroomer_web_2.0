
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../../../service/services.service';
import { EmployeeService } from '../../../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { employeeRetrive } from '../../../model/employee';
import { ServiceDTO } from '../../../model/service';
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  selectedEmployee: employeeRetrive | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      cpf: ['', [Validators.required]],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      estimated: ['', [Validators.required]],
      commission: ['', [Validators.required]],
      Active: [true, [Validators.required]],
      employeeName: [{ value: '', disabled: true }]
    });
  }

  //Função para buscar funcionário pelo CPF e preencher o formulário
  searchEmployeeByCpf(): void {
    const cpf = this.serviceForm.get('cpf')?.value;

    if (!cpf) {
      this.snackBar.open('Por favor, insira um CPF válido.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }

    this.employeeService.getEmployeeByCpf(cpf).subscribe(
      (employee: employeeRetrive) => {
        if (employee) {
          if (!employee.active){
              // Funcionário inativo
              this.snackBar.open('Funcionário inativo. Não é possível cadastrar o serviço.', 'Fechar', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
              this.selectedEmployee = null;
              this.serviceForm.patchValue({ employeeName: '' });
              return;

          }
          this.selectedEmployee = employee;

          // Preenche o campo "employeeName" com o nome do funcionário no formulário
          this.serviceForm.patchValue({ employeeName: employee.name });

          this.snackBar.open('Funcionário encontrado!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open('Funcionário não encontrado.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.selectedEmployee = null;
        }
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao consultar funcionário.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.selectedEmployee = null;
      }
    );
  }

   // Função para converter 'HH:mm' para minutos inteiros
   convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  }
  // Enviar o formulário para cadastrar o serviço
  registerService(): void {
    if (this.serviceForm.valid && this.selectedEmployee) {
      this.loading = true;

      const estimatedTime = this.serviceForm.get('estimated')?.value;
      const estimatedInMinutes = this.convertTimeToMinutes(estimatedTime);

      const serviceData: ServiceDTO = {
        ...this.serviceForm.value,
        estimated: estimatedInMinutes,
        employee: this.selectedEmployee
      };

      this.servicesService.create(serviceData).subscribe(
        () => {
          this.snackBar.open('Serviço cadastrado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
          this.serviceForm.reset();
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao cadastrar o serviço.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loading = false;
        }
      );
    } else {
      this.snackBar.open('Preencha todos os campos e verifique o CPF.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}

