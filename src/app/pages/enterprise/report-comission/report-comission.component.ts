import {Component, OnInit} from '@angular/core';
import {SchedulingRetrieve} from "../../../model/scheduling";
import {SchedulingService} from "../../../service/scheduling.service";
import {EmployeeService} from "../../../service/employee.service";

import * as xlsx from 'xlsx';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-report-comission',
  templateUrl: './report-comission.component.html',
  styleUrl: './report-comission.component.scss'
})
export class ReportComissionComponent implements  OnInit{
  schedulingForm: FormGroup;
  employees: any[] = [];
  allServices: any[] = []; // Armazena todos os serviços
  filteredReports: any[] = []; // Serviços filtrados para exibição
  totalCommission: number = 0;

  constructor(
    private fb: FormBuilder,
    private schedulingService: SchedulingService,
    private employeeService: EmployeeService
  ) {
    this.schedulingForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      employeeId: [null]
    });
  }

  ngOnInit(): void {
    this.loadCompletedSchedulings();
    this.loadEmployees();
  }

  loadCompletedSchedulings(): void {
    this.schedulingService.findAll().subscribe((schedulings: SchedulingRetrieve[]) => {
      this.allServices = schedulings
        .filter(s => s.statusScheduling === 'CONCLUIDO')
        .flatMap(s =>
          s.service.map(service => ({
            date: s.date,
            time: s.time,
            employee: service.employee,
            serviceName: service.name,
            price: service.price,
            commission: service.commission
          }))
        );
      this.applyFilter();
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  applyFilter(): void {
    const startDate = this.schedulingForm.get('startDate')?.value ? new Date(this.schedulingForm.get('startDate')?.value) : null;
    const endDate = this.schedulingForm.get('endDate')?.value ? new Date(this.schedulingForm.get('endDate')?.value) : null;
    const selectedEmployeeId = this.schedulingForm.get('employeeId')?.value;

    this.filteredReports = this.allServices.filter(service => {
      const serviceDate = new Date(service.date);

      // Verifica se a data está dentro do intervalo
      const withinDateRange = startDate && endDate ?
        (serviceDate >= startDate && serviceDate <= endDate) : true;

      // Verifica se o serviço corresponde ao funcionário selecionado
      const matchesEmployee = selectedEmployeeId ? service.employee.id === selectedEmployeeId : true;

      return withinDateRange && matchesEmployee;
    });

    this.totalCommission = this.calculateTotalCommission();
  }

  calculateTotalCommission(): number {
    return this.filteredReports.reduce((total, service) =>
      total + (service.price * service.commission / 100), 0);
  }

  submitForm() {
    if (this.schedulingForm.valid) {
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
    doc.text('Relatório de Comissões', 14, 20);

    const tableData = this.filteredReports.map(service => [
      this.formatDate(service.date),
      service.employee.name,
      service.serviceName,
      `R$ ${service.price.toFixed(2)}`,
      `R$ ${(service.price * service.commission / 100).toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Data', 'Funcionário', 'Serviço', 'Valor do Serviço', 'Comissão']],
      body: [...tableData, ['', '', '', 'Total de Comissão', `R$ ${this.totalCommission.toFixed(2)}`]],
      startY: 30,
    });

    doc.save('relatorio_comissoes.pdf');
  }

  exportToXLS(): void {
    const reportData = this.filteredReports.map(service => ({
      Data: this.formatDate(service.date),
      Funcionário: service.employee.name,
      Serviço: service.serviceName,
      Valor: service.price,
      Comissão: (service.price * service.commission) / 100
    }));

    reportData.push({
      Data: '',
      Funcionário: '',
      Serviço: '',
      Valor: 0,
      Comissão: this.totalCommission
    });

    const worksheet = xlsx.utils.json_to_sheet(reportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Relatório de Comissões');
    xlsx.writeFile(workbook, 'relatorio_comissoes.xlsx');
  }
}
