import { Component, OnInit } from '@angular/core';
import { Service } from '../../../model/service';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../../../service/services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ServiceModalComponent } from '../../modals/service-modal/service-modal.component';

@Component({
  selector: 'app-list-service',
  templateUrl: './list-service.component.html',
  styleUrl: './list-service.component.scss'
})
export class ListServiceComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  dataSource = new MatTableDataSource<Service>(this.services);
  loading = false;

  // Filtros
  statusFilter = 'all';
  nameFilter = '';
  sortOrder = 'name';

  constructor(
    private serviceService: ServicesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }

  // Carregar serviços
  loadServices(): void {
    this.loading = true;
    this.serviceService.findAll().subscribe(
      (services: Service[]) => {
        this.services = services;
        this.applyFilter(); // Aplica os filtros iniciais ao carregar os serviços
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Erro ao carregar serviços.', 'Fechar', { duration: 5000 });
        this.loading = false;
      }
    );
  }

  // Aplicar filtro de nome e status
  applyFilter(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesName = service.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || (this.statusFilter === 'active' && service.active) || (this.statusFilter === 'inactive' && !service.active);
      return matchesName && matchesStatus;
    });
    this.applySort();
  }

  // Aplicar filtro de nome
  applyNameFilter(): void {
    this.applyFilter();
    this.clearNameFilter(); // Limpar o campo de busca após aplicar o filtro
  }

  // Limpar o filtro de nome
  clearNameFilter(): void {
    this.nameFilter = '';
  }

  // Ordenar a lista de serviços
  applySort(): void {
    this.filteredServices.sort((a, b) => {
      if (this.sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.sortOrder === 'nameDesc') {
        return b.name.localeCompare(a.name);
      } else if (this.sortOrder === 'price') {
        return a.price - b.price;
      } else if (this.sortOrder === 'priceDesc') {
        return b.price - a.price;
      } else if (this.sortOrder === 'status') {
        return a.active === b.active ? 0 : a.active ? -1 : 1;
      } else if (this.sortOrder === 'statusDesc') {
        return a.active === b.active ? 0 : a.active ? 1 : -1;
      }
      return 0;
    });
    this.dataSource.data = this.filteredServices;
  }

  // Formatar preço
  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  // Ativar serviço
  activateService(service: Service): void {
    service.active = true;

    this.serviceService.update(service.id, service).subscribe(
      () => {
        this.applyFilter();
        this.snackBar.open(`Serviço ${service.name} ativado com sucesso!`, 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open('Erro ao ativar o serviço.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Desativar serviço
  deactivateService(service: Service): void {
    service.active = false;

    this.serviceService.update(service.id, service).subscribe(
      () => {
        this.applyFilter();
        this.snackBar.open('Serviço desativado com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        this.snackBar.open('Erro ao desativar o serviço.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Abrir o modal de edição de serviço
  openServiceModal(service: Service): void {
    const dialogRef = this.dialog.open(ServiceModalComponent, {
      width: '800px',
      data: { service } // Passa o serviço selecionado para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.services.findIndex(s => s.id === result.id);
        if (index > -1) {
          this.services[index] = result; // Atualiza o serviço na lista com o resultado do modal
          this.applyFilter(); // Reaplica o filtro se necessário
        }
      }
    });
  }

  // Função para converter minutos para HH:mm
  convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }
}