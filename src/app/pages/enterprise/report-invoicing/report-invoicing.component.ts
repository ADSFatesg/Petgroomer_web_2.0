import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SchedulingService} from "../../../service/scheduling.service";
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {ServiceRetrieve} from "../../../model/service";

@Component({
  selector: 'app-report-invoicing',
  templateUrl: './report-invoicing.component.html',
  styleUrl: './report-invoicing.component.scss'
})
export class ReportInvoicingComponent implements OnInit {
  revenueForm: FormGroup;
  services: { id: string, name: string }[] = []; // Lista de serviços para o filtro
  allRevenues: { date: string, serviceName: string, price: number, serviceId: string }[] = []; // Serviços de agendamentos concluídos
  filteredRevenues: { date: string, serviceName: string, price: number, serviceId: string }[] = []; // Serviços filtrados para o relatório
  totalRevenue: number = 0;

  constructor(
    private fb: FormBuilder,
    private schedulingService: SchedulingService
  ) {
    this.revenueForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      serviceId: [null] // Valor inicial null para "Todos os Serviços"
    });
  }

  ngOnInit(): void {
    this.loadCompletedSchedulings();
  }

  loadCompletedSchedulings(): void {
    this.schedulingService.findAll().subscribe((schedulings: any[]) => {
      this.allRevenues = schedulings
        .filter(scheduling => scheduling.statusScheduling === 'CONCLUIDO')
        .flatMap(scheduling => scheduling.service.map((service: ServiceRetrieve) => ({
          date: scheduling.date,
          serviceName: service.name,
          price: service.price,
          serviceId: service.id
        })));

      // Popula lista de serviços únicos para o filtro
      this.services = [...new Map(this.allRevenues.map(revenue => [revenue.serviceId, { id: revenue.serviceId, name: revenue.serviceName }])).values()];
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const startDate = this.revenueForm.get('startDate')?.value ? new Date(this.revenueForm.get('startDate')?.value) : null;
    const endDate = this.revenueForm.get('endDate')?.value ? new Date(this.revenueForm.get('endDate')?.value) : null;
    const selectedServiceId = this.revenueForm.get('serviceId')?.value;

    this.filteredRevenues = this.allRevenues.filter(revenue => {
      const revenueDate = new Date(revenue.date);

      // Verifica se a data está dentro do intervalo
      const withinDateRange = startDate && endDate ? (revenueDate >= startDate && revenueDate <= endDate) : true;

      // Verifica se o serviço corresponde ao serviço selecionado ou se "Todos os Serviços" está selecionado
      const matchesService = selectedServiceId ? revenue.serviceId === selectedServiceId : true;

      return withinDateRange && matchesService;
    });

    this.totalRevenue = this.calculateTotalRevenue();
  }

  calculateTotalRevenue(): number {
    return this.filteredRevenues.reduce((total, revenue) => total + revenue.price, 0);
  }

  submitForm() {
    if (this.revenueForm.valid) {
      this.applyFilter();
    } else {
      console.log('Formulário inválido');
    }
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Faturamento', 14, 20);

    const tableData = this.filteredRevenues.map(revenue => [
      this.formatDate(revenue.date),
      revenue.serviceName,
      `R$ ${revenue.price.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Data', 'Serviço', 'Valor']],
      body: [...tableData, ['', 'Total de Faturamento', `R$ ${this.totalRevenue.toFixed(2)}`]],
      startY: 30,
    });

    doc.save('relatorio_faturamento.pdf');
  }

  exportToXLS(): void {
    const reportData = this.filteredRevenues.map(revenue => ({
      Data: this.formatDate(revenue.date),
      Serviço: revenue.serviceName,
      Valor: revenue.price
    }));

    reportData.push({
      Data: '',
      Serviço: '',
      Valor: this.totalRevenue
    });

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Relatório de Faturamento');
    xlsx.writeFile(workbook, 'relatorio_faturamento.xlsx');
  }
}
