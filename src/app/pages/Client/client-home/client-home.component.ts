import {Component, OnInit} from '@angular/core';
import {SchedulingRetrieve} from "../../../model/scheduling";
import {PetRetrive} from "../../../model/pet";
import {SchedulingService} from "../../../service/scheduling.service";
import {PetService} from "../../../service/pet.service";
import {AuthService} from "../../../authentication/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClientService} from "../../../service/client.service";

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.scss'
})
export class ClientHomeComponent implements OnInit {
  clientName: string = '';
  nextSchedulings: SchedulingRetrieve[] = [];
  pets: PetRetrive[] = [];

  constructor(
    private schedulingService: SchedulingService,
    private petService: PetService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.loadClientData();
  }

  // Carregar os dados do cliente e agendamentos
  loadClientData(): void {
    const clientId = this.authService.getClientId();
    if (clientId) {
      // Carregar dados do cliente
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

      // Carregar todos os agendamentos futuros do cliente
      this.schedulingService.findByClientId(clientId).subscribe(
        (schedulings: SchedulingRetrieve[]) => {
          // Filtra os agendamentos futuros e ordena por data
          this.nextSchedulings = schedulings.filter(
            scheduling => new Date(scheduling.date) >= new Date()
          ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        },
        (error) => {
          this.snackBar.open(error.message || 'Nenhum agendamento', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );

      // Carregar lista de pets do cliente
      this.petService.getPetsByClientId(clientId).subscribe(
        (pets: PetRetrive[]) => {
          this.pets = pets;
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao carregar pets', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else {
      this.snackBar.open('Cliente não autenticado', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
