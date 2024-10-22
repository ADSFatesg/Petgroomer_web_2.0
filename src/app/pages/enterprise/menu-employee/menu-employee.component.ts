import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../authentication/auth.service";
import {EmployeeService} from "../../../service/employee.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-menu-employee',
  templateUrl: './menu-employee.component.html',
  styleUrl: './menu-employee.component.scss'
})
export class MenuEmployeeComponent implements OnInit{
  userName: string | null = ''; // Variável para armazenar o nome do funcionário

  constructor(
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService, // Injetando EmployeeService
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Obtém o ID do funcionário logado e, em seguida, busca o nome
    const userId = this.authService.getEmployeeId();
    if (userId) {
      this.employeeService.getEmployeeById(userId).subscribe(
        (employee) => {
          this.userName = employee.name;
        },
        (error) => {
          this.snackBar.open('Erro ao carregar os dados do funcionário.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['snack-error']
          });
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
