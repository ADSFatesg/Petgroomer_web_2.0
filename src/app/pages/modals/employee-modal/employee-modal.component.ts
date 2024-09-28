import{ Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumPosition } from '../../../model/enum-position';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CepService } from '../../../service/cep.service';
import { EnumCountry } from '../../../model/enum-country';
import { employeeRetrive } from '../../../model/employee';
import { AddressRetrive } from '../../../model/address';

@Component({
  selector: 'app-employee-modal',
  templateUrl:'./employee-modal.component.html',
  styleUrl: './employee-modal.component.scss'
})
export class EmployeeModalComponent implements OnInit {
  employeeForm!: FormGroup;
  positions = Object.values(EnumPosition);
  countries = Object.values(EnumCountry);

  constructor(
    public dialogRef: MatDialogRef<EmployeeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: employeeRetrive},
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private cepService: CepService
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário com os valores do empregado atual
    this.employeeForm = this.fb.group({
      name: [this.data.employee.name, Validators.required],
      email: [this.data.employee.email, [Validators.required, Validators.email]],
      phone: [this.data.employee.phone, Validators.required],
      cpf: [{ value: this.data.employee.cpf, disabled: true }, Validators.required], // CPF desativado
      wage: [this.data.employee.wage, Validators.required],
      position: [this.data.employee.position, Validators.required],
      postalCode: [this.data.employee.address.postalCode, Validators.required],
      street: [this.data.employee.address.street],
      number: [this.data.employee.address.number],
      complement: [this.data.employee.address.complement],
      neighborhood: [this.data.employee.address.neighborhood],
      city: [this.data.employee.address.city],
      state: [this.data.employee.address.state],
      country: [this.data.employee.address.country, Validators.required],
      active: [this.data.employee.active]
    });
  }

  // Método para salvar as atualizações do empregado
  save(): void {
    if (this.employeeForm.valid) {
      // Cria o objeto de endereço a partir dos dados do formulário
      const address = {
        postalCode: this.employeeForm.get('postalCode')!.value,
        street: this.employeeForm.get('street')!.value,
        number: this.employeeForm.get('number')!.value,
        complement: this.employeeForm.get('complement')!.value,
        neighborhood: this.employeeForm.get('neighborhood')!.value,
        city: this.employeeForm.get('city')!.value,
        state: this.employeeForm.get('state')!.value,
        country: this.employeeForm.get('country')!.value
      } as AddressRetrive

      // Combina os dados do empregado e o endereço
      const updatedEmployee: employeeRetrive = { 
        ...this.data.employee,
        address,
        wage: this.employeeForm.get('wage')!.value,
        name: this.employeeForm.get('name')!.value,
        email: this.employeeForm.get('email')!.value,
        phone: this.employeeForm.get('phone')!.value,
        position: this.employeeForm.get('position')!.value,
        active: this.employeeForm.get('active')!.value
      };

      // Chama o método update da API através do employeeService
      this.employeeService.updateEmployee(updatedEmployee.id, updatedEmployee).subscribe(
        () => {
          this.snackBar.open('Empregado atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-success']
          });

          // Fecha o modal e envia os dados atualizados de volta
          this.dialogRef.close(updatedEmployee);
        },
        (error) => {
          // Captura a mensagem de erro da API e exibe no snackBar
          const errorMessage = error.message || 'Erro ao atualizar o empregado. Tente novamente.';
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      );
    } else {
      // Se o formulário for inválido, exibe uma mensagem de erro
      this.snackBar.open('Preencha todos os campos obrigatórios corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
    }
  }

  // Método para fechar o modal sem salvar
  close(): void {
    this.dialogRef.close();
  }

  // Método para consultar o CEP e preencher o formulário com os dados do endereço
  consultarCEP(): void {
    const cep = this.employeeForm.get('postalCode')?.value;

    if (cep) {
      this.cepService.getCepInfo(cep).subscribe(
        (data: any) => {
          if (data) {
            this.employeeForm.patchValue({
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf
            });
            this.snackBar.open('Endereço atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['snack-success']
            });
          }
        },
        (error) => {
          this.snackBar.open('Erro ao consultar o CEP.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      );
    }
  }
}