import { DecimalPipe } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BaseService } from "src/factorys/services/base.service";
import { ActivatedRoute } from "@angular/router";
import { DataTarefaKambamResponse, TarefaKambamResponse } from "src/app/objects/Tarefa/TarefaKambamResponse";
import { Column } from "src/app/objects/Atividade/Column";
import { Subject } from "rxjs";
import {fromEvent} from 'rxjs';
import {debounceTime, map} from "rxjs/operators";
@Component({
  selector: 'kamban-tarefas-root',
  templateUrl: './kamban-tarefas.component.html',
  styleUrls: ['../kamban-tarefas.component.scss'],
  providers: [DecimalPipe]
})

export class KambamTarefasComponent implements OnInit,OnDestroy,AfterViewInit{
  breadCrumbItems!: Array<{}>;
  loading = false;
  submitColumn: boolean = false;
  idProjeto!: number;
  idUsuario:number = Number.parseInt(window.localStorage.getItem('IdUsuario') ?? '0')
  dataSource!: DataTarefaKambamResponse;
  destroy$ = new Subject<boolean>();
  @ViewChild('search_a', {static: false}) search_a: any;
  columnsTotal: Array<Column> = [new Column('Aguardando','bg-dark',[]),new Column('Fazendo','bg-info',[]),new Column('Concluído','bg-success',[])];

  //Tasks
  taskTotal: number = 0;
  listTaskProgress: Array<any> = [];
  listTaskWait: Array<any> = [];
  listTaskConcluido: Array<any> = [];

  constructor(private response: BaseService,private toastr: ToastrService,private route: ActivatedRoute) {
    this.breadCrumbItems = [
      { label: 'Atividades' },
      { label: 'Tarefas'},
      { label: 'Registro', active: true }
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngAfterViewInit(): void {
    fromEvent(this.search_a.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map(x => x)
      ).subscribe(() => {
        this.updateFilter_a(this.search_a.nativeElement.value);
      })
  }

  resetList(){
    this.listTaskProgress = [];
    this.listTaskWait = [];
    this.listTaskConcluido = [];
  }
 
  updateFilter_a(val: any) {

    if((this.columnsTotal[0].tasks.length + this.columnsTotal[1].tasks.length + this.columnsTotal[2].tasks.length) ==  this.taskTotal){
      this.resetList();
      this.columnsTotal[0].tasks.forEach(element => {
        this.listTaskWait.push(element)
      });
  
      this.columnsTotal[1].tasks.forEach(element => {
        this.listTaskProgress.push(element)
      });
  
      this.columnsTotal[2].tasks.forEach(element => {
        this.listTaskConcluido.push(element)
      });
    }

    this.columnsTotal[0].tasks = [];
    this.columnsTotal[0].tasks = this.listTaskWait.filter(v => v.nomeAtividade.indexOf(val)>= 0 || v.nomeTarefa.indexOf(val) >= 0);
    this.columnsTotal[1].tasks = [];
    this.columnsTotal[1].tasks = this.listTaskProgress.filter(v => v.nomeAtividade.indexOf(val)>= 0 || v.nomeTarefa.indexOf(val) >= 0);
    this.columnsTotal[2].tasks = [];
    this.columnsTotal[2].tasks = this.listTaskConcluido.filter(v => v.nomeAtividade.indexOf(val)>= 0 || v.nomeTarefa.indexOf(val) >= 0);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined){
        this.loading = true;
        this.response.Get("Tarefa","ConsultarTarefasRegistro/" + params['id'] + '/' + this.idUsuario).subscribe(
        (response: TarefaKambamResponse) =>{        
          if(response.sucesso){
            response.data.listTarefas.forEach(element => {
              if(element.statusEnum == 0){
                this.columnsTotal[0].tasks.push(element);
                this.listTaskWait.push(element)
              }else if(element.statusEnum == 1){
                this.columnsTotal[1].tasks.push(element);
                this.listTaskProgress.push(element)
              }else{
                this.columnsTotal[2].tasks.push(element);
                this.listTaskConcluido.push(element)
              };

              this.taskTotal = (this.columnsTotal[0].tasks.length + this.columnsTotal[1].tasks.length + this.columnsTotal[2].tasks.length)
            });
          }else{
            this.toastr.error(response.mensagem, 'Mensagem:');
          }
          this.loading = false;
      });
    }});
  }

  applyFilterAtividadesTarefas(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;

    filterValue = filterValue.toLocaleLowerCase();

    if(filterValue ==  undefined || filterValue == '' || filterValue == null){
      return;
    }  
  }
}

