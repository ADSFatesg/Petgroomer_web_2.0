import {Component, OnInit} from '@angular/core';
import {SchedulingRetrieve} from "../../../model/scheduling";
import {SchedulingService} from "../../../service/scheduling.service";
import {EmployeeService} from "../../../service/employee.service";

import * as xlsx from 'xlsx';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-reportComission',
  templateUrl: './report-comission.component.html',
  styleUrl: './report-comission.component.scss'
})
export class ReportComissionComponent implements  OnInit{
  schedulingForm: FormGroup;
  schedulingsConcluidos: SchedulingRetrieve[] = [];
  filteredReports: SchedulingRetrieve[] = [];
  employees: any[] = []; // Lista completa de funcionários
  selectedEmployeeId: string | null = null;
  totalCommission: number = 0;

  constructor(
    private fb: FormBuilder,
    private schedulingService: SchedulingService,
    private employeeService: EmployeeService
  ) {
    this.schedulingForm = this.fb.group({
      date: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompletedSchedulings();
    this.loadEmployees();
  }

  loadCompletedSchedulings(): void {
    this.schedulingService.findAll().subscribe((schedulings: SchedulingRetrieve[]) => {
      this.schedulingsConcluidos = schedulings.filter(s => s.statusScheduling === 'CONCLUIDO');
      this.applyFilter();
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  applyFilter(): void {
    const selectedDate: Date = this.schedulingForm.get('date')?.value;
    const formattedDate = selectedDate ? this.formatDate(selectedDate) : null;

    this.filteredReports = this.schedulingsConcluidos.filter(s => {
      const matchesEmployee = this.selectedEmployeeId ?
        s.service.some(serv => serv.employee.id === this.selectedEmployeeId) : true;

      const matchesDate = formattedDate ?
        this.formatDate(s.date) === formattedDate : true;

      return matchesEmployee && matchesDate;
    });

    // Calcula o total de comissões para o relatório filtrado
    this.totalCommission = this.calculateTotalCommission();
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

  calculateTotalCommission(): number {
    return this.filteredReports.reduce((total, report) =>
      total + report.service.reduce((serviceTotal, service) =>
        serviceTotal + (service.price * service.commission / 100), 0), 0);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Comissões', 14, 20);

    const tableData = this.filteredReports.flatMap(report =>
      report.service.map(service => [
        this.formatDate(report.date),
        service.employee.name,
        service.name,
        `R$ ${service.price.toFixed(2)}`,
        `R$ ${(service.price * service.commission / 100).toFixed(2)}`
      ])
    );

    (doc as any).autoTable({
      head: [['Data', 'Funcionário', 'Serviço', 'Valor do Serviço', 'Comissão']],
      body: [...tableData, ['', '', '', 'Total de Comissão', `R$ ${this.totalCommission.toFixed(2)}`]],
      startY: 30,
    });

    doc.save('relatorio_comissoes.pdf');
  }

  exportToXLS(): void {
    const reportData = this.filteredReports.flatMap(report =>
      report.service.map(service => ({
        Data: this.formatDate(report.date),
        Funcionário: service.employee.name,
        Serviço: service.name,
        Valor: service.price,
        Comissão: (service.price * service.commission) / 100
      }))
    );

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
