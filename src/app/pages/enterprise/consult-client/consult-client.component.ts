import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../../service/client.service';
import { ClientModalComponent } from '../../modals/client-modal/client-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClientRetrive } from '../../../model/client';

@Component({
  selector: 'app-consult-client',
  templateUrl: './consult-client.component.html',
  styleUrls: ['./consult-client.component.scss']
})
export class ConsultClientComponent implements OnInit{
  clients: ClientRetrive[] = [];
  filteredClients: ClientRetrive[] = [];
  statusFilter: string = 'all';
  cpfFilter: string = '';
  loading: boolean = false;
  sortOrder: string = 'name';

  dataSource = new MatTableDataSource<ClientRetrive>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Função para carregar a lista de clientes
  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe(
      (clientes: ClientRetrive[]) => {
        this.clients = clientes;
        this.filteredClients = clientes;
        this.applySort();
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      (error) => {
        this.snackBar.open(error.message ||'Erro ao carregar lista de clientes.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['snack-error']
        });
        this.loading = false;
      }
    );
  }

  // Aplicar a ordenação com base no critério escolhido
  applySort(): void {
    switch (this.sortOrder) {
      case 'name':
        this.filteredClients.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredClients.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'cpf':
        this.filteredClients.sort((a, b) => a.cpf.localeCompare(b.cpf));
        break;
      case 'cpfDesc':
        this.filteredClients.sort((a, b) => b.cpf.localeCompare(a.cpf));
        break;
      case 'status':
        this.filteredClients.sort((a, b) => Number(b.active) - Number(a.active));
        break;
      case 'statusDesc':
        this.filteredClients.sort((a, b) => Number(a.active) - Number(b.active));
        break;
      default:
        this.filteredClients.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Atualiza a tabela após aplicar a ordenação
    this.dataSource.data = this.filteredClients;
    this.dataSource.paginator = this.paginator;
  }

  // Método para aplicar o filtro de status (Ativo/Inativo) INDEPENDENTE do CPF
  applyFilter(): void {
    if (this.statusFilter === 'active') {
      this.filteredClients = this.clients.filter(client => client.active);
    } else if (this.statusFilter === 'inactive') {
      this.filteredClients = this.clients.filter(client => !client.active);
    } else {
      this.filteredClients = this.clients;
    }

    this.applySort();
    this.dataSource.paginator = this.paginator;
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

    this.filteredClients = this.clients.filter(client => client.cpf.includes(cpf));

    if (this.filteredClients.length === 0) {
      this.snackBar.open('CPF não encontrado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snack-error']
      });
      this.clearCpfAndReload();
    }

    this.applySort();
    this.cpfFilter = '';
  }

  clearCpfAndReload(): void {
    this.filteredClients = this.clients;
    this.applySort();
    this.dataSource.paginator = this.paginator;
  }

  // Função para abrir o modal de edição de cliente
  openClientModal(client: ClientRetrive): void {
    const dialogRef = this.dialog.open(ClientModalComponent, {
      width: '800px',
      data: { client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.clients.findIndex(c => c.id === result.id);
        if (index > -1) {
          this.clients[index] = result;
          this.applyFilter();
        }
      }
    });
  }

  deactivateClient(client: ClientRetrive): void {
    this.clientService.delete(client.id).subscribe(
      () => {
        client.active = false;
        this.applyFilter();
        this.snackBar.open('Cliente desativado com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao desativar o cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  activateClient(client: ClientRetrive): void {
    client.active = true;
    this.clientService.update(client.id, client).subscribe(
      () => {
        this.applyFilter();
        this.snackBar.open(`Cliente ${client.name} ativado com sucesso!`, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao ativar o cliente.', 'Fechar', {
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