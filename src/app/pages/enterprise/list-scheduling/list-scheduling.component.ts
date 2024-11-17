import {Component, OnDestroy, OnInit} from '@angular/core';
import { SchedulingDTO, SchedulingRetrieve } from '../../../model/scheduling';
import { SchedulingService } from '../../../service/scheduling.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulingModalComponent } from '../../modals/scheduling-modal/scheduling-modal.component';
import {interval, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-list-scheduling-client',
  templateUrl: './list-scheduling.component.html',
  styleUrl: './list-scheduling.component.scss'
})
export class ListSchedulingComponent implements OnInit,OnDestroy{
  schedulings: SchedulingRetrieve[] = [];
  filteredSchedulings: SchedulingRetrieve[] = [];
  dataSource = new MatTableDataSource<SchedulingRetrieve>(this.filteredSchedulings);
  loading = false;

  // Filtros
  cpfFilter = '';
  statusFilter = 'all';
  sortOrder = 'date';
  statusOptions = ['Agendado','Em Andamento', 'Concluido','Cancelado'];
  private statusSubscription!: Subscription;
  constructor(
    private schedulingService: SchedulingService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSchedulings();

    // Inicia a atualização automática de agendamentos a cada 5 segundos
    this.statusSubscription = interval(5000).pipe(
      switchMap(() => this.schedulingService.findAll())
    ).subscribe(
      (schedulings: SchedulingRetrieve[]) => {
        this.schedulings = schedulings;
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
    // Cancela a inscrição no intervalo para evitar vazamentos de memória
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  // Carregar agendamentos
  loadSchedulings(): void {
    this.loading = true;
    this.schedulingService.findAll().subscribe(
      (schedulings: SchedulingRetrieve[]) => {
        this.schedulings = schedulings;
        this.dataSource.data = this.schedulings;
        this.applyFilter();
        this.applySort();
        this.loading = false;
      },
      (error) => {
        this.snackBar.open(error.message ||'Erro ao carregar agendamentos.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.loading = false;
      }
    );
  }

  // Aplicar filtro por CPF e status
  applyFilter(): void {
    this.filteredSchedulings = this.schedulings.filter(scheduling => {
      const matchesCpf = this.cpfFilter ? scheduling.pet?.[0]?.client?.name?.includes(this.cpfFilter) : true;
      const matchesStatus = this.statusFilter === 'all' || scheduling.statusScheduling === this.statusFilter.toUpperCase();
  
      return matchesCpf && matchesStatus;
    });

    this.applySort();
    this.dataSource.data = this.filteredSchedulings;
  }

  // Aplicar filtro por CPF
  applyCpfFilter(): void {
    this.applyFilter();
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
    } else if (this.sortOrder === 'clientName') {

      this.filteredSchedulings.sort((a, b) => {
        return a.pet[0]?.client.name.localeCompare(b.pet[0]?.client.name);
      });
    }
    this.dataSource.data = this.filteredSchedulings;
  }


  update(scheduling: SchedulingRetrieve): void {
  this.schedulingService.updateStatus(scheduling.id, scheduling.statusScheduling).subscribe(
    () => {
      this.snackBar.open('Status do agendamento atualizado com sucesso!', 'Fechar', {
        duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
       });
      this.loadSchedulings();
      this.applyFilter();
    },
    (error) => {
      this.snackBar.open(error.message ||'Erro ao atualizar status do agendamento.', 'Fechar', {
        duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
       });
    }
  );
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
  // Função para formatar o método de pagamento
formatPaymentMethod(paymentMethod: string): string {
  switch (paymentMethod) {
    case 'DINHEIRO':
      return 'Dinheiro';
    case 'CARTAO_CREDITO':
      return 'Cartão de Crédito';
    case 'CARTAO_DEBITO':
      return 'Cartão de Débito';
    case 'TRANSFERENCIA_BANCARIA':
      return 'Transferência Bancária';
    case 'PIX':
      return 'Pix';
    case 'BOLETO_BANCARIO':
      return 'Boleto Bancário';
    default:
      return paymentMethod;
  }
}

}
