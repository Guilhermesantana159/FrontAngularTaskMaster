import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/factorys/services/base.service';
import { CronogramaResponse } from 'src/app/objects/Cronograma/CronogramaResponse';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'cronograma-root',
  templateUrl: './cronograma.component.html',
  styleUrls: ['../cronograma.component.css']
})

export class CronogramaComponent implements OnInit {
  
  //Operação
  breadCrumbItems!: Array<{}>;
  calendarOptions: CalendarOptions = {}
  calendarCor: string[] = [];
  lAtividades: Array<any> = [];
  newEventDate: any;
  editEvent: any;
  loading = false;
  
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  constructor(private toastr: ToastrService,private router: Router,private route: ActivatedRoute,private response: BaseService) { 
    //Carregar as informações do banco
    this.route.params.subscribe(params => {
      //Load Edit
      if(params['id'] != undefined){
        this.consultarCronograma(params['id']);
      }
    });

    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      initialView: "dayGridMonth",
      themeSystem: "bootstrap",
      initialEvents: [],
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      allDayText: '24 horas',
      slotLabelFormat: 'HH:mm',
      buttonText: {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Hoje',
        listWeek: 'Lista'
      },
      dayMaxEvents: true,
      locale: 'pt-br',
      eventClick: this.handleEventClick.bind(this)
    };
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Projeto' },
      { label: 'Cronograma'},
      { label: 'Cronograma do Projeto', active: true }
    ];
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;

    if(clickInfo.event.title == 'Início do projeto'
    || clickInfo.event.title == 'Previsão término do projeto'){
      return
    }

    this.router.navigate(['/main-dashboard/entities/time-line/' + clickInfo.event.id]);
  }

  generateRandomColor(calendarCor: Array<string>): string {
    let corInvalid = true;
    let cor = '';

    while(corInvalid){
      cor = this.generateColor();
      let includes = false;

      calendarCor.forEach((element) => {
        if(element = cor){
          includes = true;
          return
        };
      });

      if(includes){
        corInvalid = true;
      }else{
        corInvalid = false;
      }
    }
  
    return cor;
  }

  generateColor(): string{
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
  
    return `rgba(${r.toString()},${g.toString()},${b.toString()},1)`;
  }

  consultarCronograma(id: string){
    this.loading = true;
    this.response.Get("Projeto","ConsultarAtividadeCronogramaPorProjeto/" + id).subscribe(
    (response: CronogramaResponse) =>{        
      if(response.sucesso){
        const calendarApi = this.calendarComponent.getApi();

        //Inicio projeto
        calendarApi.addEvent({start: new Date(response.data.dataInicio), title: 'Início do projeto'});

        //Atividades
        response.data.lAtividadeCronograma.forEach(element => {
          let color = this.generateRandomColor(this.calendarCor);
          let item = {id: element.idAtividade.toString(),start: new Date(element.dataInicio),
            end:new Date(element.dataFim),title: element.nomeAtividade,textColor: color
            ,color: color.replace(',1)',',0.3)'),allDay:true}
          this.lAtividades.push(item);
          calendarApi.addEvent(item);
        });

        //Fim Projeto
        calendarApi.addEvent({start: new Date(response.data.dataFim), title: 'Previsão término do projeto'});
      }
      else
      {
        this.toastr.error(response.mensagem, 'Mensagem:');
      }
      this.loading = false;
    });
  }

}
