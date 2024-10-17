import { Component } from '@angular/core';
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {ClientService} from "../../../service/client.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-menu-client',
  templateUrl: './menu-client.component.html',
  styleUrl: './menu-client.component.scss'
})
export class MenuClientComponent {
  clientName: string | undefined;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getClientId(); // Obtém o ID do cliente do AuthService
    if (clientId) {
      this.clientService.findById(clientId).subscribe(
        (client) => {
          this.clientName = client.name; // Define o nome do cliente
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao carregar o nome do cliente.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
