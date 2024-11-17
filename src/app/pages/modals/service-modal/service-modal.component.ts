import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServicesService } from '../../../service/services.service';
import { EmployeeService } from '../../../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceDTO, ServiceRetrieve } from '../../../model/service';

@Component({
  selector: 'app-service-modal',
  templateUrl:'./service-modal.component.html',
  styleUrl: './service-modal.component.scss'
})
export class ServiceModalComponent implements OnInit{
  serviceForm!: FormGroup;
  selectedEmployee: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { service: ServiceRetrieve },
    private servicesService: ServicesService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const selectedService = this.data.service;

    // Inicializa o formulário com os dados do serviço
    this.serviceForm = this.fb.group({
      name: [selectedService.name, [Validators.required]],
      price: [selectedService.price, [Validators.required]],
      commission: [selectedService.commission, [Validators.required]],
      estimated: [this.convertMinutesToTime(selectedService.estimated), [Validators.required]], 
      active: [selectedService.active],
      cpf: [selectedService.employee ? selectedService.employee.cpf : '', [Validators.required]],
      employeeName: [{ value: selectedService.employee ? selectedService.employee.name : '', disabled: true }]
    });

    this.selectedEmployee = selectedService.employee;
  }

  // Função para buscar o funcionário pelo CPF
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
      (employee) => {
        if (employee) {
          this.selectedEmployee = employee;
          this.serviceForm.patchValue({ employeeName: employee.name });
          this.snackBar.open('Funcionário encontrado!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        } else {
          this.snackBar.open('Funcionário não encontrado.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      },
      (error) => {
        this.snackBar.open(error.message ||'Erro ao consultar funcionário.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  save(): void {
    if (this.serviceForm.valid) {
      const updatedService: ServiceRetrieve = {
        ...this.data.service,
        ...this.serviceForm.value,
        estimated: this.convertTimeToMinutes(this.serviceForm.get('estimated')?.value),
        employee: this.selectedEmployee
      };

      this.servicesService.update(updatedService.id, updatedService).subscribe(
        () => {
          this.snackBar.open('Serviço atualizado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.dialogRef.close(updatedService);
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar o serviço.', 'Fechar', {
            duration: 3000
          });
        }
      );
    }
  }

  // Converte HH:mm para minutos
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  }

  // Converte minutos para HH:mm
  convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}