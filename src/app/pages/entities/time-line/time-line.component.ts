import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AtividadeTimeLine } from 'src/app/objects/Tarefa/AtividadeTimeLine';
import { TarefaMovimentacaoResponse } from 'src/app/objects/Tarefa/TarefaMovimentacaoResponse';
import { BaseService } from 'src/factorys/services/base.service';

@Component({
  selector: 'time-line-root',
  templateUrl: 'time-line.component.html',
  styleUrls: ['time-line.component.css']
})

export class TimeLineComponent{
  loading: boolean = false;
  idUsuario: number = parseInt(localStorage.getItem('IdUsuario') ?? '0');
  timeLine: Array<AtividadeTimeLine> = [];

  constructor(private response: BaseService,private toastr: ToastrService,private route: ActivatedRoute) {
  
  this.route.params.subscribe(params => {
    if(params['id'] != undefined){
      this.loading = true;
      this.response.Get("Tarefa","ConsultarMovimentacao/" + params['id']).subscribe(
        (response: TarefaMovimentacaoResponse) =>{      
          if(response.sucesso){
            // Criacao Projeto
            this.timeLine.push({
              data: response.data.dataInicioProjeto,
              foto: localStorage.getItem('Foto') ?? "",
              statusDe: undefined,
              statusAte: undefined,
              usuario: localStorage.getItem('NomeUsuario') ?? "",
              tarefaNome: undefined,
              point: false,
              atvidade: false,
              projeto: true
            });

            //Criação da atividade
            this.timeLine.push({
              data: response.data.dataInicioAtividade,
              foto: localStorage.getItem('Foto') ?? "",
              statusDe: undefined,
              statusAte: undefined,
              usuario: localStorage.getItem('NomeUsuario') ?? "",
              tarefaNome: undefined,
              point: false,
              atvidade: true,
              projeto: false
            });

            if(response.data.lMovimentacao.length > 0){
              response.data.lMovimentacao.forEach(element => {
                this.timeLine.push({
                  foto: element.foto,
                  data: element.dataMovimentacaoFormatDate,
                  usuario: element.nomeUsuario,
                  statusDe: element.de,
                  statusAte: element.para,
                  tarefaNome: undefined,
                  point: true,
                  atvidade: false,
                  projeto: false
                });
              });
            }

            //Fim da atividade
            this.timeLine.push({
              data: response.data.dataFimAtividade,
              foto: localStorage.getItem('Foto') ?? "",
              statusDe: undefined,
              statusAte: undefined,
              usuario: localStorage.getItem('NomeUsuario') ?? "",
              tarefaNome: undefined,
              point: false,
              atvidade: true,
              projeto: false
            });

            //Fim Projeto
            this.timeLine.push({
              data: response.data.dataFimProjeto,
              foto: localStorage.getItem('Foto') ?? "",
              statusDe: undefined,
              statusAte: undefined,
              usuario: localStorage.getItem('NomeUsuario') ?? "",
              tarefaNome: undefined,
              point: false,
              atvidade: false,
              projeto: true
            });

          }
          else
          {
            this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
          }
          this.loading = false;

          this.timeLine = this.timeLine.reduce((acc: AtividadeTimeLine[], current) => {
            const insertIndex = acc.findIndex(item => convertBrazilianDateToDateObject(item.data) < convertBrazilianDateToDateObject(current.data));
            if (insertIndex === -1) {
              acc.unshift(current); // Insert at the beginning of the array
            } else {
              acc.splice(insertIndex, 0, current);
            }
            return acc;
          }, []);

        }
      );
    }});

    function convertBrazilianDateToDateObject(dateString: string): Date{
      const dateParts = dateString.split('/');
      if (dateParts.length !== 3) {
        return new Date; 
      }
      
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; 
      const year = parseInt(dateParts[2], 10);
    
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return new Date; 
      }
    
      const date = new Date(year, month, day);
      return date;
    }
}

}
