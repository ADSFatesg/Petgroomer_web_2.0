import {Component, OnInit} from '@angular/core';
import {SchedulingRetrieve} from "../../../model/scheduling";
import {SchedulingService} from "../../../service/scheduling.service";
import {StatusSchedulingEnum} from "../../../model/status-scheduling-enum";

@Component({
  selector: 'app-agenda',
  templateUrl:'./agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements  OnInit {
  schedulingsAgendados: SchedulingRetrieve[] = [];
  schedulingsEmAndamento: SchedulingRetrieve[] = [];

  constructor(private schedulingService: SchedulingService) {}

  ngOnInit(): void {
    this.loadSchedulings();
  }

  loadSchedulings(): void {
    this.schedulingService.findAll().subscribe((schedulings: SchedulingRetrieve[]) => {
      // Obter a data de hoje no formato 'YYYY-MM-DD'
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      console.log('Data de hoje formatada:', todayString);
      console.log('Todos os agendamentos:', schedulings);

      // Filtrar agendamentos Agendados para a data atual
      this.schedulingsAgendados = schedulings.filter(s => {
        const schedulingDate = new Date(s.date).toISOString().split('T')[0];
        return s.statusScheduling === StatusSchedulingEnum.AGENDADO && schedulingDate === todayString;
      });

      // Filtrar agendamentos Em Andamento para a data atual
      this.schedulingsEmAndamento = schedulings.filter(s => {
        const schedulingDate = new Date(s.date).toISOString().split('T')[0];
        return s.statusScheduling === StatusSchedulingEnum.EM_ANDAMENTO && schedulingDate === todayString;
      });

      console.log('Agendamentos Agendados:', this.schedulingsAgendados);
      console.log('Agendamentos Em Andamento:', this.schedulingsEmAndamento);
    });
  }

  // Método para formatar a data como 'YYYY-MM-DD'
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
