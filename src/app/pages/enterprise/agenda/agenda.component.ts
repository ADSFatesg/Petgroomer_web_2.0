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

  constructor(private schedulingService: SchedulingService) {
  }

  ngOnInit(): void {
    this.loadSchedulings();
  }

  loadSchedulings(): void {
    this.schedulingService.findAll().subscribe((schedulings: SchedulingRetrieve[]) => {
      const today = new Date();
      const todayString: any = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

      console.log('Todos os agendamentos:', schedulings); // Log dos agendamentos retornados

      // Filtrar agendamentos Agendados pela data
      this.schedulingsAgendados = schedulings.filter(s =>
        s.statusScheduling === StatusSchedulingEnum.AGENDADO && s.date === todayString
      );

      // Filtrar agendamentos Em Andamento pela data
      this.schedulingsEmAndamento = schedulings.filter(s =>
        s.statusScheduling === StatusSchedulingEnum.EM_ANDAMENTO.valueOf() && s.date === todayString
      );

      console.log('Agendamentos Agendados:', this.schedulingsAgendados);
      console.log('Agendamentos Em Andamento:', this.schedulingsEmAndamento); // Log para verificar se os agendamentos em andamento estão corretos
    });
  }
}
