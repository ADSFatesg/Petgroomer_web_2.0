import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SchedulingRetrieve} from "../../../model/scheduling";
import {MatTableDataSource} from "@angular/material/table";
import {PaymentMethodEnum} from "../../../model/payment-method-enum";
import {SchedulingService} from "../../../service/scheduling.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../authentication/auth.service";
import {StatusSchedulingEnum} from "../../../model/status-scheduling-enum";
import {SchedulingModalComponent} from "../../modals/scheduling-modal/scheduling-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {interval, Subscription, switchMap} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-list-scheduling-client',
  templateUrl: './list-scheduling-client.component.html',
  styleUrl: './list-scheduling-client.component.scss'
})
export class ListSchedulingClientComponent implements  OnInit,OnDestroy{
  schedulings: SchedulingRetrieve[] = [];
  filteredSchedulings: SchedulingRetrieve[] = [];
  dataSource = new MatTableDataSource<SchedulingRetrieve>(this.filteredSchedulings);
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtros e opções
  statusFilter = 'all';
  sortOrder = 'date';
  statusOptions = ['Agendado', 'Em Andamento', 'Concluido', 'Cancelado'];
  paymentMethods = Object.values(PaymentMethodEnum); // Lista de métodos de pagamento
  private statusSubscription!: Subscription;
  constructor(
      private schedulingService: SchedulingService,
      private snackBar: MatSnackBar,
      private authService: AuthService,
      public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClientSchedulings();

    // Configura a atualização automática a cada 5 segundos
    this.statusSubscription = interval(5000).pipe(
        switchMap(() => {
          const clientId = this.authService.getClientId();
          if (clientId) {
            return this.schedulingService.findByClientId(clientId);
          }
          return [];
        })
    ).subscribe(
        (schedulings: SchedulingRetrieve[]) => {
          this.schedulings = schedulings;
          this.dataSource.data = this.schedulings;
          this.applyFilter();
          this.applySort();
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar agendamentos.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
    );
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar vazamento de memória
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  // Carregar agendamentos do cliente logado
  loadClientSchedulings(): void {
    this.loading = true;
    // Obter o ID do cliente logado
    const clientId = this.authService.getClientId();
    if (clientId) {
      this.schedulingService.findByClientId(clientId).subscribe(
          (schedulings: SchedulingRetrieve[]) => {
            this.schedulings = schedulings;
            this.dataSource.data = this.schedulings;
            this.applyFilter();
            this.applySort();
            this.loading = false;
            this.dataSource.paginator = this.paginator;
          },
          (error) => {
            this.snackBar.open(error.message || 'Nenhum Agendamento realizado.', 'Fechar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.loading = false;
          }
      );
    } else {
      this.snackBar.open('Cliente não autenticado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.loading = false;
    }
  }

  // Método para atualizar o método de pagamento
  updatePaymentMethod(scheduling: SchedulingRetrieve): void {
    this.schedulingService.updateMethodPayment(scheduling.id, scheduling.paymentMethod).subscribe(
        () => {
          this.snackBar.open('Método de pagamento atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao atualizar método de pagamento.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
    );
  }

  // Método para cancelar o agendamento
  cancelScheduling(scheduling: SchedulingRetrieve): void {
    this.schedulingService.updateStatus(scheduling.id,StatusSchedulingEnum.CANCELADO).subscribe(
        () => {
          this.snackBar.open('Agendamento cancelado com sucesso!', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.loadClientSchedulings();
        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao cancelar agendamento.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
    );
  }

  // Aplicar filtro por status
  applyFilter(): void {
    this.filteredSchedulings = this.schedulings.filter(scheduling => {
      const matchesStatus = this.statusFilter === 'all' || scheduling.statusScheduling === this.statusFilter.toUpperCase();
      return matchesStatus;
    });

    this.applySort();
    this.dataSource.data = this.filteredSchedulings;
  }

  // Ordenar os agendamentos
  applySort(): void {
    if (this.sortOrder === 'date') {
      this.filteredSchedulings.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
    } else if (this.sortOrder === 'time') {
      this.filteredSchedulings.sort((a, b) => a.time.localeCompare(b.time));
    }
    this.dataSource.data = this.filteredSchedulings;
  }
  // Abrir modal de edição de agendamento
  openEditModal(scheduling: SchedulingRetrieve): void {
    const dialogRef = this.dialog.open(SchedulingModalComponent, {
      width: '800px',
      data: { scheduling}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.schedulings.findIndex(c => c.id === result.id);
        if (index > -1) {
          this.schedulings[index] = result;
          this.applyFilter();
        }
      }
    });
  }
  formatPaymentMethod(paymentMethod: string): string {
    // Substitui os caracteres especiais por espaços e capitaliza a primeira letra
    return paymentMethod
      .replace(/_/g, ' ') // Substitui "_" por espaço
      .toLowerCase() // Coloca todo o texto em minúsculas
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitaliza a primeira letra de cada palavra
  }

}
