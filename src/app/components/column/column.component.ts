import { Component, Input } from "@angular/core";
import {CdkDragDrop,moveItemInArray,transferArrayItem} from "@angular/cdk/drag-drop";
import { Column } from "src/app/objects/Atividade/Column";
import { TarefaListResponse } from "src/app/objects/Tarefa/TarefaAdmResponse";
import { ToastrService } from "ngx-toastr";
import { BaseService } from "src/factorys/services/base.service";
import { RetornoPadrao } from "src/app/objects/RetornoPadrao";

@Component({
  selector: "kanban-column",
  templateUrl: "./column.component.html",
  styleUrls: ["./column.component.scss"]
})
export class KanbanColumnComponent {
  @Input() column!: Column;
  itemMovido!: TarefaListResponse;
  idUsuario: number = parseInt(localStorage.getItem('IdUsuario') ?? '0');

  constructor(private response: BaseService,private toastr: ToastrService){

  }

  drop(event: CdkDragDrop<TarefaListResponse[]> | any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } 
    else {
      let oldList:Array<TarefaListResponse> = [];

      this.column.tasks.forEach(element => {
        oldList.push(element);
      });

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.column.tasks.forEach(element => {
        if(!oldList.includes(element)){
          this.itemMovido = element;
        }
      });

      if(!this.itemMovido.permiteInicio){
        this.toastr.warning('Aguarde a data ' + this.itemMovido.dataInicio + ' para o início desta atividade!', 'Mensagem:');
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
      }
      else{
        this.response.Post("Tarefa","IntegrarMovimentacao/",{
          To: event.container.id == "Fazendo" ? 1 : (event.container.id == "Aguardando" ? 0 : 2),
          IdTarefa: this.itemMovido.idTarefa,
          IdUsuarioMovimentacao: this.idUsuario
        }).subscribe(
          (response: RetornoPadrao) => {    
            if(!response.sucesso){
              this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
            }
          }
        );
      } 
    }
  }
}
