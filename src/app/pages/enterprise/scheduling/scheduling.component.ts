import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetRetrive } from '../../../model/pet';
import { PetService } from '../../../service/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntityId, ServiceRetrieve } from '../../../model/service';
import { PaymentMethodEnum, PaymentMethodOptions } from '../../../model/payment-method-enum';
import { SchedulingService } from '../../../service/scheduling.service';
import { ClientRetrive } from '../../../model/client';
import { ClientService } from '../../../service/client.service';
import { ServicesService } from '../../../service/services.service';
import { SchedulingDTO } from '../../../model/scheduling';
import { StatusSchedulingEnum } from '../../../model/status-scheduling-enum';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.scss'
})
export class SchedulingComponent implements OnInit {
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
    private clientService: ClientService 
  ) {}

  ngOnInit(): void {
    this.schedulingForm = this.fb.group({
      cpf: ['', [Validators.required]],
      clientName: [{ value: '', disabled: true }],
      pet: ['', Validators.required],
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      observations: [''],
      paymentMethod: ['', Validators.required],
      statusScheduling: [StatusSchedulingEnum.AGENDADO]
    });

    // Carregar serviços ao inicializar
    this.loadServices();
  }

  // Função para carregar todos os serviços disponíveis
  loadServices(): void {
    this.serviceService.findAll().subscribe(
      (services) => {
        this.services = services;
        this.services = this.services.filter(service => service.active);
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

  // Função para consultar os pets pelo CPF do cliente
  consultarPets(): void {
    const cpf = this.schedulingForm.get('cpf')?.value;

    if (!cpf || cpf.trim() === '') {
      this.snackBar.open('CPF não foi informado.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return;
    }
  
    this.clientService.findByCpf(cpf).subscribe(
      (client: ClientRetrive) => {
        // Verifica se o cliente existe
        if (!client || !client.id) {
          this.snackBar.open('Cliente não encontrado.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          return; 
        }
  
        // Verifica se o cliente está ativo
        this.clientActive = client.active;
        if (!this.clientActive) {
          this.snackBar.open('Cliente está desativado. Não é possível agendar.', 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          // Limpa o campo de pet e do nome do cliente
          this.schedulingForm.get('pet')?.setValue('');
          this.schedulingForm.get('clientName')?.setValue('');
          return; 
        }
  
        // Se o cliente está ativo, carrega os dados do cliente
        this.selectedClient = client.name;
        this.schedulingForm.get('clientName')?.setValue(client.name);
  
        // Carrega os pets do cliente
        this.loadPets(client.id);
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao consultar cliente.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  
  }

  // Função para carregar os pets associados ao cliente
  loadPets(clientId: string): void {
    this.petService.getPetsByClientId(clientId).subscribe(
      (pets) => {
        this.pets = pets.filter(pet => pet.active);
        this.noActivePets = this.pets.length === 0;
      },
      (error) => {
        this.snackBar.open(error.message || 'Erro ao carregar pets.', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }

  // Função para registrar o agendamento
  registerScheduling(): void {
    if (this.schedulingForm.valid && this.selectedClient) {
      const { cpf, clientName, ...formValues } = this.schedulingForm.value;
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
    this.selectedServices.push({ id: service.id,name: service.name, price: service.price });
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