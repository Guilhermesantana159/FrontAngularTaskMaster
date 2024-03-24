import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DefaultService } from 'src/factorys/services/default.service';
import { ConsultaModalParams } from 'src/app/objects/Consulta-Padrao/ConsultaModalParams';
import { BaseService } from 'src/factorys/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTarefaAdmResponse, TarefaAdmResponse, TarefaListResponse } from 'src/app/objects/Tarefa/TarefaAdmResponse';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { ConsultaModal } from 'src/app/objects/Consulta-Padrao/consulta-modal';
import { ListViewServiceAdministracaoTarefa } from './Administracao-service.service';
import { Observable } from 'rxjs';
import { NgbdListViewSortableHeaderAdministracaoTarefa } from './Administracao-tarefas-crud.directive';

@Component({
  selector: 'administracao-tarefas-crud-root',
  templateUrl: './administracao-tarefas-crud.component.html',
  styleUrls: ['../administracao-tarefas.component.css'],
  providers: [ListViewServiceAdministracaoTarefa, DecimalPipe]
})

export class AdministracaoTarefasCrudComponent{
  //Operação
  @ViewChildren(NgbdListViewSortableHeaderAdministracaoTarefa) headers!: QueryList<NgbdListViewSortableHeaderAdministracaoTarefa>;
  breadCrumbItems!: Array<{}>;
  data: DataTarefaAdmResponse = {
    listAtividade: [],
    indicadores: {
      tarefasFazer: 0,
      tarefasCompletas: 0,
      tarefasProgresso: 0,
      tarefasAtrasadas: 0
    },
    listTarefas: [],
    isView: true
  }; 
  resetIndicadores:boolean = true;
  loading: boolean = false;
  idProjeto: string = '0';

  //Criacão e edição tarefas
  IsNew: boolean = true;
  paramsConsultaUsuario: ConsultaModalParams;
  tarefaFormGroup!: FormGroup;
  submitted = false;
  ltags:Array<string> = []
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  validNome: boolean = true;
  messageError: string = ""

  //Grid
  listViewList: Observable<TarefaListResponse[]>;
  total: Observable<number>;
  dataSource?: any;
  isView?: boolean = true;

  constructor(private modalService: NgbModal,defaultService: DefaultService, public service: ListViewServiceAdministracaoTarefa,
    private response: BaseService,private toastr: ToastrService,private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder) {

    this.tarefaFormGroup = this.formBuilder.group({
      descricao: [undefined, [Validators.required]],
      lResponsavel: [[]],
      atividade: [undefined, [Validators.required]],
      prioridade: ["0"],
      descricaoTarefa: [undefined],
      idTarefa: [undefined],
      lTagsTarefa: [[]],
      status: [0]
    });

    this.paramsConsultaUsuario = {
      Label: 'Responsável pela Tarefa',
      Title: 'Consulta de Usuários',
      Disabled: false,
      Class: 'col-sm-12 col-xs-8 col-md-8 col-lg-8',
      Required: false,
      GridOptions: defaultService.Modal.ConsultaPadraoUsuarioMulti,
      SelectedText: '',
      SelectedValue: '',
      OnlyButton: false
    };

    this.route.params.subscribe(params => {
      if(params['id'] != undefined){
        this.idProjeto = params['id'];
        this.ConsultarTarefasByIdProjeto(params['id']);
      }
    });

    this.listViewList = service.customers$;
    this.total = service.total$;

    setTimeout(() => {
      this.listViewList.subscribe(x => {
        this.dataSource = x;
      });
    }, 3000);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Atividade' },
      { label: 'Tarefas' },
      { label: 'Administração de tarefas', active: true }
    ];

  }

  //Consulta
  ConsultarTarefasByIdProjeto(id: string){
    this.loading = true;
    this.resetIndicadores = true;

    this.response.Get("Tarefa","ConsultarTarefasPorIdProjeto/" + id).subscribe(
      (response: TarefaAdmResponse) =>{      
        this.resetIndicadores = true;
        if(response.sucesso){
          this.data = response.data; 
          this.isView = response.data.isView;
          this.service.customers = response.data.listTarefas
          this.resetIndicadores = false;
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  //Grid
  onSort({ column, direction }: any) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  //Cadastro
  openModal(content: any) {
    this.IsNew = true;
    this.submitted = false;
    this.tarefaFormGroup.reset();
    this.ltags = [];

    this.modalService.open(content, { size: 'md', centered: true });
  }

  IntegrarTarefa(form: FormGroup){
    this.submitted = true;
    this.validNome = true;

    if(form.invalid){
      this.toastr.error('<small>Preencha os campos corretamente!</small>', 'Mensagem:');
      return;
    }

    if(form.get('atividade')?.value.lTarefas != undefined){
      let count = 0;
      form.get('atividade')?.value.lTarefas.forEach((element: any) => {
        if(element == form.get('descricao')?.value){
          count = count + 1;
        }
      });

      if(this.IsNew && count > 0){
        this.validNome = false;
      }

      if(!this.validNome){
        this.messageError = "A Atividade selecionada já possui uma tarefa com este nome cadastrado";
        return;
      }
    
    }

    let request = {
      IdTarefa: form.get('idTarefa')?.value,
      Descricao: form.get('descricao')?.value,
      LUsuarioIds: this.ListResponsavelId(form.get('lResponsavel')?.value),
      IdAtividade: form.get('atividade')?.value.idAtividade,
      DescricaoTarefa: form.get('descricaoTarefa')?.value,
      LTagsTarefa: form.get('lTagsTarefa')?.value,
      Prioridade: parseInt(form.get('prioridade')?.value ?? "0"),
      Status: parseInt(form.get('status')?.value ?? "0")
    };
   
    this.loading = true;
    this.response.Post("Tarefa","Integrar",request).subscribe(
      (response: RetornoPadrao) =>{      
        if(response.sucesso){
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');
          this.ConsultarTarefasByIdProjeto(this.idProjeto);
          this.tarefaFormGroup.reset();
          this.modalService.dismissAll();
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      }
    );
  }

  Remove(tag: string): void {
    const index = this.ltags.indexOf(tag);

    if (index >= 0) {
      this.ltags.splice(index, 1);
    }

    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(this.ltags);
  }

  Add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.ltags.push(value);
    }

    event.chipInput!.clear();
    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(this.ltags);
  }

  ListResponsavelId(list: Array<ConsultaModal>){
    let retorno: string[] = [];

    if(list != undefined){
      list.forEach(element => {
        retorno.push(element.SelectedValue ?? "0");
      });
    }
  

    return retorno;
  };

  DeletarTarefa(id: string){
    this.loading = true;
    this.response.Post("Tarefa","Deletar/" + id,null).subscribe(
      (response: RetornoPadrao) =>{      
        if(response.sucesso){
          this.toastr.success('<small>' + response.mensagem + '</small>', 'Mensagem:');
          this.ConsultarTarefasByIdProjeto(this.idProjeto);
        }
        else
        {
          this.toastr.error('<small>' + response.mensagem + '</small>', 'Mensagem:');
        }
        this.loading = false;
      });
  };

  EditarTarefa(dataTarefa: TarefaListResponse,content: any){
    this.IsNew = false
    this.submitted = false;
    this.tarefaFormGroup.reset();
    this.ltags = [];
    this.tarefaFormGroup.get('lResponsavel')?.setValue([]);

    this.tarefaFormGroup.get('descricao')?.setValue(dataTarefa.nomeTarefa);
    this.tarefaFormGroup.get('idTarefa')?.setValue(dataTarefa.idTarefa);
    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(dataTarefa.lTags);
    this.tarefaFormGroup.get('descricaoTarefa')?.setValue(dataTarefa.descricaoTarefa);
    this.tarefaFormGroup.get('prioridade')?.setValue(dataTarefa.prioridadeEnum.toString());
    this.tarefaFormGroup.get('status')?.setValue(dataTarefa.statusEnum);

    this.data.listAtividade.forEach(element => {
      if(dataTarefa.idAtividade == element.idAtividade){
        this.tarefaFormGroup.get('atividade')?.setValue(element);
        return;
      }
    });

    dataTarefa.lResponsavelTarefa.forEach(element => {
      this.tarefaFormGroup.get('lResponsavel')?.value.push({
        SelectedValue: element.idUsuario,
        SelectedText: element.nome
      });
    });

    this.ltags = dataTarefa.lTags;

    this.modalService.open(content, { size: 'md', centered: true });
  }
 
};




