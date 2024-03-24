import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataComentarioTarefaResponse } from 'src/app/objects/Projeto/DataComentarioTarefaResponse';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { DataTarefaDetalhesResponse, TarefaDetalhesResponse } from 'src/app/objects/Tarefa/TarefasDetalhes';
import { BaseService } from 'src/factorys/services/base.service';

@Component({
  selector: 'detalhes-root',
  templateUrl: 'detalhes-tarefas.component.html',
  styleUrls: ['detalhes-tarefas.component.css']
})

export class DetalhesTarefasComponent{
  loading: boolean = false;
  data: DataTarefaDetalhesResponse | undefined;
  comentarioFormGroup!: FormGroup;
  idUsuario: number = parseInt(localStorage.getItem('IdUsuario') ?? '0');
  idTarefa: number = 0;

  constructor(private response: BaseService,private toastr: ToastrService,private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder) {
  
  this.route.params.subscribe(params => {
    if(params['id'] != undefined){
      this.loading = true;

      this.response.Get("Tarefa","ConsultarDetalhesTarefa/" + params['id']).subscribe(
        (response: TarefaDetalhesResponse) =>{      
          if(response.sucesso){
            this.data = response.data;
            this.idTarefa = parseInt(params['id'])  
          }
          else
          {
            this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
          }
          this.loading = false;
        }
      );
    }
    });

    this.comentarioFormGroup = this.formBuilder.group({
      descricao: [undefined, [Validators.required]]
    });
  }

  Enviar(form: FormGroup){
    this.response.Post("Tarefa","IntegrarComentarioTarefa/",{
      Descricao: form.get('descricao')?.value,
      IdTarefa: this.idTarefa,
      IdUsuario: this.idUsuario
    }).subscribe(
      (response: RetornoPadrao) => {      
        if(!response.sucesso){
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }else{
          this.data?.lComentarios.push({
            foto: localStorage.getItem('Foto') ?? '',
            nomeUsuario: localStorage.getItem('NomeUsuario') ?? '',
            horario: this.FormatarDataAtual(),
            comentario: form.get('descricao')?.value
          })
        }
        this.loading = false;
        this.comentarioFormGroup.get('descricao')?.setValue(undefined);
      }
    );
  }

  FormatarDataAtual() {
    var data = new Date();
    var diaSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    var mesNome = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    var diaData = data.getDate();
    var diaSemanaTextoData = diaSemana[data.getDay()];
    var mesData = mesNome[data.getMonth()];
    var anoData = data.getFullYear();
    var horasData = data.getHours();
    var minutosData = data.getMinutes();
    var segundosData = data.getSeconds();

    // Formata os valores para duas casas (ex: 01, 02, 03)
    let dia = diaData.toString().padStart(2, '0');
    let horas = horasData.toString().padStart(2, '0');
    let minutos = minutosData.toString().padStart(2, '0');
    let segundos = segundosData.toString().padStart(2, '0');

    var dataFormatada = diaSemanaTextoData + ', ' + dia + ' de ' + mesData + ' de ' + anoData + ' ' + horas + ':' + minutos + ':' + segundos;
    return dataFormatada;
  }
  
}



