import { Component } from '@angular/core';
import {EntityId, ServiceRetrieve} from "../../../model/service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PetRetrive} from "../../../model/pet";
import {PaymentMethodEnum, PaymentMethodOptions} from "../../../model/payment-method-enum";
import {PetService} from "../../../service/pet.service";
import {SchedulingService} from "../../../service/scheduling.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ServicesService} from "../../../service/services.service";
import {ClientService} from "../../../service/client.service";
import {AuthService} from "../../../authentication/auth.service";
import {StatusSchedulingEnum} from "../../../model/status-scheduling-enum";
import {ClientRetrive} from "../../../model/client";
import {SchedulingDTO} from "../../../model/scheduling";

@Component({
  selector: 'app-client-scheduling',
  templateUrl: './client-scheduling.component.html',
  styleUrl: './client-scheduling.component.scss'
})
export class ClientSchedulingComponent {
  schedulingForm!: FormGroup;
  pets: PetRetrive[] = [];
  services: ServiceRetrieve[] = [];
  paymentMethods = PaymentMethodOptions;
  selectedClient: string = '';
  noActivePets: boolean = false;
  noActiveService: boolean = false;
  clientActive: boolean = true;
  selectedServices: { id: string, name: string, price: number }[] = [];
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private schedulingService: SchedulingService,
    private snackBar: MatSnackBar,
    private serviceService: ServicesService,
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.schedulingForm = this.fb.group({
      clientName: [{ value: '', disabled: true }],
      pet: ['', Validators.required],
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      observations: [''],
      paymentMethod: ['', Validators.required],
      statusScheduling: [StatusSchedulingEnum.AGENDADO]
    });

    // Carregar o cliente logado e seus pets
    const clientId = this.authService.getClientId();
    if (clientId) {
      this.loadClientData(clientId);
    }

    // Carregar serviços disponíveis
    this.loadServices();
  }

  // Função para carregar todos os serviços disponíveis
  loadServices(): void {
    this.serviceService.findAll().subscribe(
      (services) => {
        this.services = services.filter(service => service.active);
        this.noActiveService = this.services.length === 0;
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao carregar serviços.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Carregar dados do cliente e seus pets
  private loadClientData(clientId: string): void {
    this.clientService.findById(clientId).subscribe(
      (client: ClientRetrive) => {
        // Verifica se o cliente está ativo
        if (!client.active) {
          this.snackBar.open('Cliente desativado. Não é possível agendar.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.clientActive = false;
          return;
        }

        this.clientActive = true;
        this.selectedClient = client.name;
        this.schedulingForm.get('clientName')?.setValue(client.name);

        // Carrega os pets ativos do cliente
        this.loadPets(client.id);
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao carregar dados do cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Função para carregar os pets associados ao cliente
  private loadPets(clientId: string): void {
    this.petService.getPetsByClientId(clientId).subscribe(
      (pets) => {
        this.pets = pets.filter(pet => pet.active);
        this.noActivePets = this.pets.length === 0;
      },
      (error) => {
        this.snackBar.open(error.message || 'Nenhum Pet encontrado.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Função para registrar o agendamento
  registerScheduling(): void {
    if (this.schedulingForm.valid && this.clientActive) {
      const { clientName, ...formValues } = this.schedulingForm.value;
      const selectedServiceIds: EntityId[] = this.selectedServices.map(service => service.id as unknown as EntityId);

      const schedulingData: SchedulingDTO = {
        pet: { id: formValues.pet },
        service: selectedServiceIds,
        date: formValues.date,
        time: formValues.time,
        observations: formValues.observations,
        paymentMethod: formValues.paymentMethod,
        statusScheduling: formValues.statusScheduling
      };

      this.schedulingService.create(schedulingData).subscribe(
        () => {
          this.snackBar.open('Agendamento cadastrado com sucesso!', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.schedulingForm.reset();
          this.selectedServices = [];
          this.total = 0;

        },
        (error) => {
          this.snackBar.open(error.message || 'Erro ao cadastrar agendamento.', 'Fechar', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }

  // Método para adicionar o serviço ao carrinho
  addService(serviceId: string): void {
    const service = this.services.find(s => s.id === serviceId);

    if (service) {
      this.selectedServices.push({ id: service.id, name: service.name, price: service.price });
      this.calculateTotal();
    } else {
      this.snackBar.open('Serviço não encontrado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }

  // Método para calcular o total dos serviços
  calculateTotal(): void {
    this.total = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
  }

  // Método para remover um serviço do carrinho
  removeService(serviceId: string): void {
    this.selectedServices = this.selectedServices.filter(service => service.id !== serviceId);
    this.calculateTotal();
  }
}
