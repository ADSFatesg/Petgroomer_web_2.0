import { employeeRetrive } from './../../../model/employee';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../service/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeModalComponent } from '../../modals/employee-modal/employee-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-consult-employee',
  templateUrl: './consult-employee.component.html',
  styleUrl: './consult-employee.component.scss'
})
export class ConsultEmployeeComponent implements OnInit {
  employees: employeeRetrive[] = [];
  filteredEmployees: employeeRetrive[] = [];
  statusFilter: string = 'all';
  cpfFilter: string = '';
  sortOrder: string = 'name';
  loading: boolean = false;

  dataSource = new MatTableDataSource<employeeRetrive>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe(
      (employees: employeeRetrive[]) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.applySort();
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Erro ao carregar empregados.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-error']
        });
        this.loading = false;
      }
    );
  }

  applySort(): void {
    switch (this.sortOrder) {
      case 'name':
        this.filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredEmployees.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'cpf':
        this.filteredEmployees.sort((a, b) => a.cpf.localeCompare(b.cpf));
        break;
      case 'cpfDesc':
        this.filteredEmployees.sort((a, b) => b.cpf.localeCompare(a.cpf));
        break;
      case 'position':
        this.filteredEmployees.sort((a, b) => a.position.localeCompare(b.position));
        break;
      case 'positionDesc':
        this.filteredEmployees.sort((a, b) => b.position.localeCompare(a.position));
        break;
      case 'status':
        this.filteredEmployees.sort((a, b) => Number(b.active) - Number(a.active));
        break;
      case 'statusDesc':
        this.filteredEmployees.sort((a, b) => Number(a.active) - Number(b.active));
        break;
      default:
        this.filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.dataSource.data = this.filteredEmployees;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(): void {
    if (this.statusFilter === 'active') {
      this.filteredEmployees = this.employees.filter(employee => employee.active);
    } else if (this.statusFilter === 'inactive') {
      this.filteredEmployees = this.employees.filter(employee => !employee.active);
    } else {
      this.filteredEmployees = this.employees;
    }
    this.applySort();
  }

  applyCpfFilter(): void {
    const cpf = this.cpfFilter.trim();

    if (cpf === '') {
      this.snackBar.open('Digite um CPF.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      this.clearCpfAndReload();
      return;
    }

    this.filteredEmployees = this.employees.filter(employee => employee.cpf.includes(cpf));

    if (this.filteredEmployees.length === 0) {
      this.snackBar.open('CPF não encontrado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      this.clearCpfAndReload();
    }

    this.dataSource.data = this.filteredEmployees;
    this.dataSource.paginator = this.paginator;
    this.cpfFilter = ''; // Limpa o campo de CPF após a busca
  }

  clearCpfAndReload(): void {
    this.filteredEmployees = this.employees;
    this.dataSource.data = this.filteredEmployees;
    this.dataSource.paginator = this.paginator;
  }

  openEmployeeModal(employee: employeeRetrive): void {
    const dialogRef = this.dialog.open(EmployeeModalComponent, {
      width: '600px',
      data: { employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.employees.findIndex(e => e.id === result.id);
        if (index > -1) {
          this.employees[index] = result;
          this.applyFilter();
        }
      }
    });
  }

  deactivateEmployee(employee: employeeRetrive): void {
    this.employeeService.deleteEmployee(employee.id).subscribe(
      () => {
        employee.active = false;
        this.applyFilter();
        this.snackBar.open('Empregado desativado com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open('Erro ao desativar o empregado.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  activateEmployee(employee: employeeRetrive): void {
    employee.active = true;

    this.employeeService.updateEmployee(employee.id, employee).subscribe(
      () => {
        this.applyFilter();
        this.snackBar.open(`Empregado ${employee.name} ativado com sucesso!`, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open('Erro ao ativar o empregado.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  formatCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}