import { Component, OnInit } from '@angular/core';
import { ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import { ChartType } from './dashboard.model';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/factorys/services/base.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtividadeDataDashboard, AtividadeTarefaDataDashboard, FeedbackDataDashboard, ProjetoDashboard, ProjetoDataDashboard, TarefaDashboard } from 'src/app/objects/Projeto/ProjetoDashboard';
import { BaseOptions } from 'src/app/objects/Select/SelectPadrao';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackResponse } from 'src/app/objects/Util/FeedbackResponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  //Operação de tela
  loading: boolean = false;
  idUsuario: number = parseInt(localStorage.getItem("IdUsuario") ?? '0');
  nomeUsuario: string = localStorage.getItem("NomeUsuario") ?? "";
  mainFormGroup: FormGroup;
  lProjeto: Array<BaseOptions> = [];
  projetoList: Array<ProjetoDataDashboard> = [];
  resetIndicadores:boolean = true;
  projeto!: ProjetoDataDashboard;
  atividade!: AtividadeDataDashboard;
  lTarefaUsuario: Array<TarefaDashboard> = [];
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  @ViewChild("chartTarefa", { static: false }) chartTarefa!: ChartComponent;

  public AtividadeChart: any;
  graficoAtividadeTarefa!: ChartType;
  atividadeTarefas: AtividadeTarefaDataDashboard | undefined;

  //Feedback
  feedbackFormGroup: FormGroup;
  loadingRating: boolean = false;
  feedback: FeedbackDataDashboard | undefined
  rate: number = 0;

  constructor(private response: BaseService,private toastr: ToastrService,private formBuilder: FormBuilder,private modalService: NgbModal) {
    this.mainFormGroup = this.formBuilder.group({
      projeto: [undefined, Validators.required]
    });

    this.feedbackFormGroup = this.formBuilder.group({
      comentario: [undefined],
      rating: [undefined, Validators.required]
    });

    this.mainFormGroup.controls['projeto'].valueChanges.subscribe(value => {

      let indexProjeto = this.projetoList.findIndex(x => x.idProjeto == value);
      
      if(indexProjeto != -1){
        this.resetIndicadores = true;
        this.projeto = this.projetoList[indexProjeto];
        this.resetIndicadores = false;
      }
      else
      {
        this.projetoList = [];
        this.InitTela(value);
      }
    });
    
  }

  ngOnInit(): void {
    this.InitTela(0);
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  private InitChartTarefa(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.graficoAtividadeTarefa = {
      chart: {
        height: 370,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        dashArray: [0, 0, 8],
        width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
        name: 'Tempo da tarefa em espera hora(s)',
        type: 'bar',
        data: []
      }, {
        name: 'Tempo total previsto da atividade hora(s)',
        type: 'bar',
        data: []
      }, {
        name: 'Tempo da tarefa em progresso hora(s)',
        type: 'line',
        data: []
      },
      {
        name: 'Tempo realizado da tarefa hora(s)',
        type: 'area',
        data: []
      }],
      fill: {
        opacity: [1, 1, 1,0.1],
      },
      markers: {
        size: [0, 0, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: [
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "7%",
          barHeight: "70%",
        },
      },
    };

    this.atividadeTarefas?.lTarefas.forEach(element => {
      this.graficoAtividadeTarefa.xaxis.categories.push(element.tarefa)

      //Espera
      this.graficoAtividadeTarefa.series[0].data.push(element.tempoTarefaEspera > 0 ? element.tempoTarefaEspera : 0);

      //Previsto
      this.graficoAtividadeTarefa.series[1].data.push(element.tempoTarefaTotal > 0 ? element.tempoTarefaTotal : 0);

      //Progresso
      this.graficoAtividadeTarefa.series[2].data.push(element.tempoTarefaProgresso > 0 ? element.tempoTarefaProgresso : 0);

      //Realizado
      this.graficoAtividadeTarefa.series[3].data.push((element.tempoTarefaEspera + element.tempoTarefaProgresso) > 0 ? (element.tempoTarefaEspera + element.tempoTarefaProgresso) : 0);
    });

  }

  private InitChartAtividadeProjeto(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.AtividadeChart = {
      series: [this.atividade?.indicador?.tarefasFazer, this.atividade?.indicador?.tarefasProgresso, this.atividade?.indicador?.tarefasCompletas, this.atividade?.indicador?.tarefasAtrasadas],
      labels: ["Aberto", "Progresso", "Completo", "Atrasado"],
      chart: {
        height: 333,
        type: "donut",
      },
      legend: {
        position: "bottom",
      },
      stroke: {
        show: false
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors
    };
  }

  SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.remove('d-block');
    }
  }

  InitTela(idProjeto: number){
    this.loading = true;
    this.resetIndicadores = true;

    this.response.Get("Projeto","ConsultarDashboard/" + idProjeto.toString() + '/' + this.idUsuario.toString()).subscribe(
      (response: ProjetoDashboard) =>{        
        if(response.sucesso){

          if(this.lProjeto.length == 0){
            response.data.lProjetos.forEach(element => {
              this.lProjeto.push(element);
              this.resetIndicadores = false;
            });
          }

          if(this.lTarefaUsuario.length == 0){
            response.data.lTarefas.forEach(element => {
              this.lTarefaUsuario.push(element);
            });
          }
         
          if(response.data.projeto != undefined){
            this.projeto = response.data.projeto;
            this.atividade = response.data.projeto.lAtividade[0];
            this.atividadeTarefas = response.data.projeto.lAtividade[0].lAtividadeTarefas[0];
            this.projetoList.push(response.data.projeto);

            this.mainFormGroup.get('projeto')?.setValue(response.data.projeto.idProjeto);
          }

          if(this.feedback == undefined){
            this.feedback = response.data.feedback;
            this.rate = response.data.feedback.mediaFeedback;
          }

          this.InitChartAtividadeProjeto('["--vz-warning", "--vz-primary", "--vz-success", "--vz-danger", "--vz-info"]');
          this.InitChartTarefa('["--vz-warning", "--vz-primary", "--vz-info", "--vz-success", "--vz-info"]');
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  AtividadeSelect(atividade: AtividadeDataDashboard){
    //Donut
    if(atividade == this.atividade){
      return;
    }
    
    this.atividade = atividade;

    this.AtividadeChart.series = [];

    this.AtividadeChart.series.push(this.atividade.indicador?.tarefasFazer);
    this.AtividadeChart.series.push(this.atividade.indicador?.tarefasProgresso);
    this.AtividadeChart.series.push(this.atividade.indicador?.tarefasCompletas);
    this.AtividadeChart.series.push(this.atividade.indicador?.tarefasAtrasadas);

    this.chart.updateSeries(this.AtividadeChart.series)

    //Lines and bar
    this.graficoAtividadeTarefa.series[0].data = [];
    this.graficoAtividadeTarefa.series[1].data = [];
    this.graficoAtividadeTarefa.series[2].data = [];
    this.graficoAtividadeTarefa.series[3].data = [];


    this.atividade?.lAtividadeTarefas.forEach(elementAtv => {

      elementAtv.lTarefas.forEach(element => {
        this.graficoAtividadeTarefa.xaxis.categories.push(element.tarefa)

        //Espera
        this.graficoAtividadeTarefa.series[0].data.push(element.tempoTarefaEspera > 0 ? element.tempoTarefaEspera : 0);
  
        //Previsto
        this.graficoAtividadeTarefa.series[1].data.push(element.tempoTarefaTotal > 0 ? element.tempoTarefaTotal : 0);
  
        //Progresso
        this.graficoAtividadeTarefa.series[2].data.push(element.tempoTarefaProgresso > 0 ? element.tempoTarefaProgresso : 0);
  
        //Realizado
        this.graficoAtividadeTarefa.series[3].data.push((element.tempoTarefaEspera + element.tempoTarefaProgresso) > 0 ? (element.tempoTarefaEspera + element.tempoTarefaProgresso) : 0);
      });

      this.chartTarefa.updateSeries(this.graficoAtividadeTarefa.series)

    });

  }

  openModalFeedback(content: any) {
    this.feedbackFormGroup.reset();

    this.modalService.open(content, { size: 'md', centered: true });
  }

  SalvarFeedback(form: FormGroup){
    this.loadingRating = true;

    this.response.Post("Utils","CadastrarFeedback",{
      Rating: parseInt(form.get('rating')?.value ?? '5'),
      Comentario: form.get('comentario')?.value,
      IdUsuarioCadastro: this.idUsuario
    }).subscribe(
      (response: FeedbackResponse) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
          this.modalService.dismissAll();
          this.feedback = response.data;
          this.rate = response.data.mediaFeedback;
        }
        else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }
        this.loadingRating = false;
      }
    );
  }
}
