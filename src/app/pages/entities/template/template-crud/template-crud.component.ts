import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/factorys/services/base.service';
import { DefaultService } from 'src/factorys/services/default.service';
import { Tarefa } from 'src/app/objects/Tarefa/Tarefas';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { GridAtvTarefas } from 'src/app/objects/Tarefa/GridAtvTarefas';
import { TarefaEquipe } from 'src/app/objects/Projeto/GridTarefaEquipe';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { BaseOptions, SelectPadrao } from 'src/app/objects/Select/SelectPadrao';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';
import { Cronograma } from 'src/app/objects/Template/Cronograma';
import { AtividadeTemplateRequest, TemplateRequest } from 'src/app/objects/Template/TemplateRequest';
import { TemplateResponse } from 'src/app/objects/Template/TemplateResponse';

@Component({
  selector: 'template-crud-root',
  templateUrl: './template-crud.component.html',
  styleUrls: ['../template.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TemplateCrudComponent implements OnInit,OnDestroy{
  //Variaveis funcionais comportamento da tela tela
  loading = false;
  TemplateRegisterFormGroup: FormGroup;
  submitRegister = false;
  indexTab: number = 0;
  IsNew = true;
  IsAdmin: string = window.localStorage.getItem('Perfil') ?? "false";
  IdUsuarioLogado: number = Number.parseInt(window.localStorage.getItem('IdUsuario') ?? '1');
  disabledAll = false;

  //Variaveis Aba Atividades Tarefas
  AtividadeRegisterFormGroup: FormGroup;
  submitAtv: boolean = false;
  lTarefa: any[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  data: GridAtvTarefas[] = [];
  @ViewChild("customNav") nav: any;
  dataSource = new MatTableDataSource(this.data);
  addOnBlur = true;
  atividade!: Observable<any>;
  position: number = 0;
  editTarefa: boolean = false;
  tarefaFormGroup!: FormGroup;
  ltags:Array<string> = []

  //Aba Principal
  optionsCategoria: Array<BaseOptions> = [
    { 
      description: "Outros",
      value: 0
    }];
  
  index: any;

  //CronoGrama
  itemMovido!: GridAtvTarefas | undefined;


  constructor(private formBuilder: FormBuilder,private modalService: NgbModal,private response: BaseService,private defaultService: DefaultService,private router: Router,
    private route: ActivatedRoute,private toastr: ToastrService,private changeDetectorRef: ChangeDetectorRef) {    
    
    this.TemplateRegisterFormGroup = this.formBuilder.group({
      idTemplate: [undefined],
      titulo: [undefined, [Validators.required]],
      escalaTempo: ["0", [Validators.required]],
      quantidade: [undefined, [Validators.required]],
      categoria: ["0", [Validators.required]],      
      newCategoria: [undefined],      
      descricao: [undefined, [Validators.required]],     
      foto: [undefined],
      idUsuarioCadastro: [undefined],
      dataCadastro: [undefined]
    });

    this.AtividadeRegisterFormGroup = this.formBuilder.group({
      idAtividade: [undefined],
      statusAtividade: [undefined],
      atividadeDescricao: [undefined, [Validators.required]],
      escalaTempoAtividade: [undefined, [Validators.required]],
      lTarefas: [undefined, [Validators.required]],
      position: [undefined]
    });

    this.tarefaFormGroup = this.formBuilder.group({
      descricao: [undefined, [Validators.required]],
      prioridade: ["0"],
      descricaoTarefa: [undefined],
      atividade: [undefined, [Validators.required]],
      lTagsTarefa: [[]]
    });
  }

  ngOnInit() {
    this.changeDetectorRef.detectChanges();
    this.atividade = this.dataSource.connect();

    this.response.Get("Template","ConsultarCategorias/").subscribe(
      (response: SelectPadrao) =>{        
        if(response.sucesso){
          response.data.forEach(element => {
           this.optionsCategoria.push(element);    
          });

          this.route.params.subscribe(params => {
            if(params['id'] != undefined){
              this.loading = true;
              this.response.Get("Template","ConsultarViaId/" + params['id']).subscribe(
              (response: TemplateResponse) =>{        
                if(response.sucesso){
                  this.IsNew = false;
                  this.loading = false;
                  this.disabledAll = response.data.idUsuarioCadastro != this.IdUsuarioLogado;
                  this.TemplateRegisterFormGroup.patchValue(response.data);

                  //Parte do cronograma
                  this.lCronograma = [];
                  this.lAtividadesCronograma = [];

                  for (let index = 1; index <= response.data.quantidade; index++) {
                    this.lCronograma.push({
                      id: index,
                      title: (this.TemplateRegisterFormGroup.get('escalaTempo')?.value == "0" ? 'Dia ' : 'Semana ')  + index.toString(),
                      listAtividades: []
                    });
                  }
      
                  response.data.lAtividade.forEach(element => {
                    this.position = this.position + 1;
      
                    let GridAtvTarefas:GridAtvTarefas = {
                      position: this.position,
                      idAtividade: undefined,
                      atividade: element.titulo,
                      escalaTempoAtividade: element.tempoPrevisto.toString(),
                      dataInicial: '',
                      dataFim: '',
                      listTarefas: element.lTarefaTemplate,
                      statusAtividade: undefined
                    }
                    this.dataSource.data.push(GridAtvTarefas);
                    this.dataSource.filter = "";  
                    
                    //Posicionar primeiro
                    let posicao = element.posicao - 1;
                    this.lCronograma[posicao].listAtividades.push(GridAtvTarefas);

                    let tempo = element.tempoPrevisto;
                    if(tempo <= (this.lCronograma.length - posicao)){
                      let itensTamanho = (tempo - 1)
                      for (let index = 1; index <= itensTamanho; index++) {
                        this.lCronograma[posicao + index].listAtividades.push(GridAtvTarefas);
                      }
                    }
                  });

                  if(this.disabledAll){
                    this.toastr.info('Você está no modo visualização!', 'Mensagem:');
                    return;
                  }
                }
                else{
                  this.toastr.error(response.mensagem, 'Mensagem:');
                }
      
              this.loading = false;
            });
          }else{
            this.disabledAll = false;
          }});
        }
        else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }
    });
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }

  //Operacional tela
  Salvar = (form:FormGroup) =>{
    this.loading = true;
    this.submitRegister = true;

    if(form.invalid){
      this.loading = false;
      this.toastr.error('<small>Preencha os campos corretamente no formulário!</small>', 'Mensagem:');
      return;
    }

    if(this.dataSource.data.length == 0){
      this.loading = false;
      this.toastr.error('<small>Cadastre no mínimo uma atividade para seu template!</small>', 'Mensagem:');
      return;
    }

    if(this.lAtividadesCronograma.length > 0){
      this.loading = false;
      this.toastr.error('<small>Relacione todas as atividades a um cronogroma!</small>', 'Mensagem:');
      return;
    }

    if(this.TemplateRegisterFormGroup.get('categoria')?.value == "0" && 
    (this.TemplateRegisterFormGroup.get('newCategoria')?.value == undefined || (this.TemplateRegisterFormGroup.get('newCategoria')?.value == ""))){
      this.loading = false;
      this.toastr.error('<small>Selecione ou cadastre uma nova categoria!</small>', 'Mensagem:');
      return;
    }

    //Formatação para Save
    let templateRequest:TemplateRequest = {
      IdTemplate: this.TemplateRegisterFormGroup.get('idTemplate')?.value,
      Titulo: this.TemplateRegisterFormGroup.get('titulo')?.value,
      Descricao: this.TemplateRegisterFormGroup.get('descricao')?.value,
      QuantidadeTotal: parseInt(this.TemplateRegisterFormGroup.get('quantidade')?.value),
      IdTemplateCategoria: parseInt(this.TemplateRegisterFormGroup.get('categoria')?.value),
      Escala: parseInt(this.TemplateRegisterFormGroup.get('escalaTempo')?.value),
      DescricaoCategoriaNova: this.TemplateRegisterFormGroup.get('newCategoria')?.value,
      IdUsuarioCadastro: parseInt(localStorage.getItem('IdUsuario') ?? '0'),
      Foto: this.TemplateRegisterFormGroup.get('foto')?.value,
      LAtividade: []
    }

    //Atividade
    this.dataSource.data.forEach(function(element){
      let Atv:AtividadeTemplateRequest = {
        TempoPrevisto: parseInt(element.escalaTempoAtividade ?? '0'),
        IdTemplate: templateRequest.IdTemplate,
        Titulo: element.atividade,
        Posicao: 0,
        LTarefaTemplate: []
      };

      element.listTarefas.forEach(element => {
        element.prioridade = parseInt(element.prioridade ?? '0');
        Atv.LTarefaTemplate.push(element);
      });
      
      templateRequest.LAtividade.push(Atv);
    });

    templateRequest.LAtividade.forEach(atividade => {
      this.lCronograma.forEach(cronograma => {
        if(cronograma.listAtividades.findIndex(x => x.atividade == atividade.Titulo) != -1 && atividade.Posicao == 0){
          atividade.Posicao = cronograma.id;
        }
      });
  
    });

    this.response.Post("Template","IntegrarTemplate",templateRequest).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
          this.router.navigateByUrl('/main-dashboard/entities/template')
        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }
        this.loading = false;
      }
    );
  };

  //Aba Atvidades/Tarefas
  AdicionarGridAtividade(form:FormGroup){
    let validDuplicidade = true;
    this.submitAtv = true;

    if(this.AtividadeRegisterFormGroup.invalid){
      this.toastr.error('<small>Preencha os campos corretamente para adicionar uma atividade!</small>', 'Mensagem:');
      return;
    }

    if(this.TemplateRegisterFormGroup.get('quantidade')?.value == undefined || this.TemplateRegisterFormGroup.get('quantidade')?.value == "0"){
      this.toastr.error('<small>Preencha o período estimado do template para adicionar uma atividade!</small>', 'Mensagem:');
      return;
    }

    if(parseInt(this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.value ?? '0') <= 0){
      this.toastr.error('<small>Duração de tempo da atividade inválido!</small>', 'Mensagem:');
      return;
    }


    var objAtv:GridAtvTarefas = {
      idAtividade: form.get('idAtividade')?.value,
      statusAtividade: undefined,
      position: form.get('position')?.value ?? 0,
      escalaTempoAtividade:  form.get('escalaTempoAtividade')?.value,
      atividade: form.get('atividadeDescricao')?.value,
      dataInicial: '',
      dataFim: '',
      listTarefas: form.get('lTarefas')?.value,
    };

    //Verificação duplicidade tarefas e atvidade
    objAtv.listTarefas.forEach(element => {
      if(objAtv.listTarefas.map(x => x.descricao).indexOf(element.descricao) != 
        objAtv.listTarefas.map(x => x.descricao).lastIndexOf(element.descricao)){
        this.toastr.error('<small>Não é permitido o cadastro de tarefas iguais em uma mesma atividade!</small>', 'Mensagem:');
        validDuplicidade = false;
      }
    });

    if(!validDuplicidade){
      return;
    }

    if(objAtv.position == 0){
      this.position = this.position + 1;
      objAtv.position = this.position;
      this.dataSource.data.forEach(element => {
        if(element.atividade == objAtv.atividade){
          this.toastr.error('<small>Não é permitido o cadastro de atividades com nomes iguais!</small>', 'Mensagem:');
          validDuplicidade = false;
        }
      });
  
      if(!validDuplicidade){
        return;
      }

      this.dataSource.data.push(objAtv);
      this.lAtividadesCronograma.push(objAtv)
    }
    else{
      this.dataSource.data.forEach(element => {
        if(element.atividade == objAtv.atividade && element.position != objAtv.position){
          this.toastr.error('<small>Não é permitido o cadastro de atividades com nomes iguais!</small>', 'Mensagem:');
          validDuplicidade = false;
        }
      });
  
      if(!validDuplicidade){
        return;
      }

      //Editar
      for (let index = 0; index < this.dataSource.data.length; index++) {
        if(this.dataSource.data[index].position == objAtv.position){          
          this.dataSource.data[index] = objAtv;
          this.dataSource.filter = "";
          break;
        } 
      }

      this.ChangePeriodoCronograma(objAtv);
    }

    //Operação
    this.submitAtv = false;
    this.dataSource.filter = "";

    //Reset Campos
    this.ResetarCamposAtividades();
    this.editTarefa = false;
  }

  ChangePeriodoCronograma(objAtv: GridAtvTarefas){
    //Estando na aba semanas ou dias
    let repetidos = 0;
    let alteracaoTamanho = false;
    let indexInicial = -1;
    let tamanhoAnterior = 0;
    let tamanhoNovo = parseInt(objAtv.escalaTempoAtividade ?? '0');
    this.lCronograma.forEach(element => {
      for (let index = 0; index < element.listAtividades.length; index++) {
        if(element.listAtividades[index].position == objAtv.position){
          if(element.listAtividades[index].escalaTempoAtividade != objAtv.escalaTempoAtividade){
            if(indexInicial == -1){
              tamanhoAnterior = element.listAtividades[index].escalaTempoAtividade;
              indexInicial = index;
            }
            alteracaoTamanho = true;
          }
          element.listAtividades[index].escalaTempoAtividade = objAtv.escalaTempoAtividade;
          element.listAtividades[index].atividade = objAtv.atividade;
          element.listAtividades[index].listTarefas = objAtv.listTarefas;

          repetidos = repetidos + 1;

          if(repetidos > parseInt(objAtv.escalaTempoAtividade ?? '0')){
            element.listAtividades.splice(index,1)
          }
        }
        
      }
    });

    if(alteracaoTamanho){
      if(tamanhoNovo > tamanhoAnterior){
        let indexExcede = 0;

        if(indexInicial + tamanhoNovo > (this.lCronograma.length - 1)){
          indexExcede = (indexInicial + tamanhoNovo) - (this.lCronograma.length - 1);
        }else{
          indexInicial = indexInicial - 1;
        }
        
        if(indexExcede < 0){
          indexInicial = indexInicial - indexExcede + 1;
        }

        let indexFim = indexInicial + tamanhoNovo;
        for (let index = 0; index < this.lCronograma.length; index++) {
          let indexListAtividade = this.lCronograma[index].listAtividades.findIndex(x => x.atividade == objAtv.atividade);

          if(index < indexInicial || index > indexFim){
            if(indexListAtividade != -1){
              this.lCronograma[index].listAtividades.splice(index,1)
            }
          }else{
            if(indexListAtividade == -1){
              this.lCronograma[index].listAtividades.push(objAtv)
            }
          }
        }
      }
      else{
        for (let index = 0; index < this.lCronograma.length; index++) {
          let indexListAtividade = this.lCronograma[index].listAtividades.findIndex(x => x.atividade == objAtv.atividade);
          let indexFim = indexInicial +  tamanhoNovo -1;

          if(index < indexInicial || index > indexFim){
            if(indexListAtividade != -1){
              this.lCronograma[index].listAtividades.splice(index,1)
            }
          }
        }
      }
    }

    //Estando na aba atividades
    for (let index = 0; index < this.lAtividadesCronograma.length; index++) {
      if(this.dataSource.data[index].position == objAtv.position){          
        this.lAtividadesCronograma[index] = objAtv;
        break;
      } 
    }
  }

  DeletarAtividade(Atv: GridAtvTarefas){
    //Deletar Atividade na Grid Atividade
    for (let index = 0; index < this.dataSource.data.length; index++) {
      if(this.dataSource.data[index].position == Atv.position){
        this.dataSource.data.splice(index,1);
        this.dataSource.filter = "";
      }
    }    

    //Estando na aba semanas ou dias
    this.lCronograma.forEach(element => {
      for (let index = 0; index < element.listAtividades.length; index++) {
        if(element.listAtividades[index].position == Atv.position){
          element.listAtividades.splice(index,1);
          break
        }
      }
    });

    //Estando na aba atividades
    for (let index = 0; index < this.lAtividadesCronograma.length; index++) {
      if(this.lAtividadesCronograma[index].position == Atv.position){          
        this.lAtividadesCronograma.splice(index,1);
        break
      } 
    }

    //Reset Campos
    this.ResetarCamposAtividades();
  }

  EditarAtividade(Atv: GridAtvTarefas){
    this.editTarefa = true;

    //Reset Campos
    this.ResetarCamposAtividades();
  
    this.AtividadeRegisterFormGroup.get('idAtividade')?.setValue(Atv.idAtividade);
    this.AtividadeRegisterFormGroup.get('atividadeDescricao')?.setValue(Atv.atividade);
    this.AtividadeRegisterFormGroup.get('lTarefas')?.setValue(Atv.listTarefas);
    this.AtividadeRegisterFormGroup.get('position')?.setValue(Atv.position);
    this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.setValue(Atv.escalaTempoAtividade);
    
    Atv.listTarefas.forEach(element => {
      this.lTarefa.push({descricao:element.descricao,idTarefa: element.idTarefa,prioridade: element.prioridade,lTagsTarefa: element.lTagsTarefa,descricaoTarefa: element.descricaoTarefa});
    });
  };

  ResetarCamposAtividades(){
    this.AtividadeRegisterFormGroup.get('idAtividade')?.setValue(undefined);
    this.AtividadeRegisterFormGroup.get('atividadeDescricao')?.setValue(undefined);
    this.AtividadeRegisterFormGroup.get('lTarefas')?.setValue(undefined);
    this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.setValue(undefined);
    this.AtividadeRegisterFormGroup.get('position')?.setValue(undefined);
    this.lTarefa = [];
  }
  
  applyFilterAtividades(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  Add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.lTarefa.push({descricao:value,idTarefa: undefined,prioridade: '0',lTagsTarefa:[],descricaoTarefa: undefined});
    }

    event.chipInput!.clear();
    this.AtividadeRegisterFormGroup.get('lTarefas')?.setValue(this.lTarefa);
  }

  AddTags(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.ltags.push(value);
    }

    event.chipInput!.clear();
    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(this.ltags);
  }

  Remove(tarefa: Tarefa): void {
    if(tarefa.idTarefa != undefined)
    {
      return
    }

    const index = this.lTarefa.indexOf(tarefa);

    if (index >= 0) {
      this.lTarefa.splice(index, 1);
    }

    this.AtividadeRegisterFormGroup.get('lTarefas')?.setValue(this.lTarefa);
  }

  RemoveTag(tag: string): void {
    const index = this.ltags.indexOf(tag);

    if (index >= 0) {
      this.ltags.splice(index, 1);
    }

    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(this.ltags);
  }

  LimparCampoDataAtividade(){
    this.AtividadeRegisterFormGroup.get('dataFimAtv')?.setValue(undefined);
    this.AtividadeRegisterFormGroup.get('dataInicioAtv')?.setValue(undefined);
  }

  
  ComplementarTarefa(form:FormGroup){
   for (let index = 0; index < this.dataSource.data.length; index++) {
      if(this.dataSource.data[index].atividade == form.get('atividade')?.value){
        this.dataSource.data[index].listTarefas.forEach(element => {
            if(element.descricao == form.get('descricao')?.value){
              element.prioridade = form.get('prioridade')?.value;
              element.descricaoTarefa = form.get('descricaoTarefa')?.value;
              element.lTagsTarefa = form.get('lTagsTarefa')?.value;
            }
        });
      }
    }    
    this.modalService.dismissAll();
    this.ResetCamposTarefa();
  }

  //Operacional
  ChangeFoto = (event:any) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file); 

    reader.onloadend = () => {
      let base64data: any = reader.result;
      this.TemplateRegisterFormGroup.get('foto')?.setValue(base64data);
    }
  };

  OpenFileUpload = () => {
    document.getElementById("customFile")?.click();
  };
  

  openModal(content: any) {
    this.modalService.open(content, { size: 'md', centered: true });
  }

  openModalcomplementar(content: any,tarefa: any,atividade:string) {
    this.ResetCamposTarefa();

    //Edição
    this.tarefaFormGroup.get('descricao')?.setValue(tarefa.descricao);
    this.tarefaFormGroup.get('prioridade')?.setValue(tarefa.prioridade);
    this.tarefaFormGroup.get('descricaoTarefa')?.setValue(tarefa.descricaoTarefa);
    this.tarefaFormGroup.get('atividade')?.setValue(atividade);
    this.tarefaFormGroup.get('lTagsTarefa')?.setValue(tarefa.lTagsTarefa);

    if(tarefa.lTagsTarefa != undefined){
      this.ltags = tarefa.lTagsTarefa;
    }

    this.modalService.open(content, { size: 'md', centered: true });
  }

  DeletarAtividadeExistente(Atv: GridAtvTarefas){
    if(Atv == undefined){
      return
    }

    let lAtvExistentes = [];

    this.dataSource.data.forEach(element => {
      if(element.idAtividade != undefined){
        lAtvExistentes.push(element);
      }
    });

    if(lAtvExistentes.length <= 1){
      this.toastr.error('<small>Não é permitido deletar esta atividade pois é necessário ter pelo menos uma cadastrada no projeto!</small>', 'Mensagem:');
      return
    }

    this.response.Post("Projeto","DeletarAtividade/" + Atv.idAtividade,null).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
          this.DeletarAtividade(Atv);
        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }
        this.loading = false;
      }
    );

  }

  ResetCamposTarefa(){
    this.tarefaFormGroup.get('descricao')?.setValue(undefined);
    this.tarefaFormGroup.get('prioridade')?.setValue(undefined);
    this.tarefaFormGroup.get('descricaoTarefa')?.setValue(undefined);
    this.tarefaFormGroup.get('atividade')?.setValue(undefined);
    this.tarefaFormGroup.get('lTagsTarefa')?.setValue([]);
    this.ltags = [];
  }

  VerificarValor(){
    if(this.TemplateRegisterFormGroup.get('quantidade')?.value == "e" || this.TemplateRegisterFormGroup.get('quantidade')?.value == undefined){
      this.TemplateRegisterFormGroup.get('quantidade')?.setValue(undefined);
      return;
    }

    let value = parseInt(this.TemplateRegisterFormGroup.get('quantidade')?.value);
    let escala = this.TemplateRegisterFormGroup.get('escalaTempo')?.value == "0" ? 'dias' : 'semanas' 

    for (let index = 0; index < this.dataSource.data.length; index++) {
      if(parseInt(this.dataSource.data[index].escalaTempoAtividade ?? '0') > value){
        this.dataSource.data[index].escalaTempoAtividade = value.toString();
        this.dataSource.filter = "";
      }
    }    

    if(value > 999){
      this.TemplateRegisterFormGroup.get('quantidade')?.setValue(999);
      this.toastr.warning('<small>Valor máximo de '+ escala +' é 999!</small>', 'Mensagem:');
      return;
    }

    let valueAtividade = parseInt(this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.value);
    if(valueAtividade > value){
      this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.setValue(value);
      this.toastr.warning('<small>Valor inválido: Este valor ultrapassa a quantidade máxima de '+ escala +' cadastrada para o template!</small>', 'Mensagem:');
    }

    //Parte do cronograma
    if(this.lCronograma.length == 0){
      for (let index = 1; index <= value; index++) {
        this.lCronograma.push({
          id: index,
          title: (this.TemplateRegisterFormGroup.get('escalaTempo')?.value == "0" ? 'Dia ' : 'Semana ')  + index.toString(),
          listAtividades: []
        });
      }
    }else{
      debugger
      this.lCronograma = [];
      this.lAtividadesCronograma = [];

      for (let index = 1; index <= value; index++) {
        this.lCronograma.push({
          id: index,
          title: (this.TemplateRegisterFormGroup.get('escalaTempo')?.value == "0" ? 'Dia ' : 'Semana ')  + index.toString(),
          listAtividades: []
        });
      }
      
      this.dataSource.data.forEach(element => {
        this.lAtividadesCronograma.push(element);
      });
    }
  }

  verficaValorAtividade(){
    if(this.TemplateRegisterFormGroup.get('quantidade')?.value == "e" || this.TemplateRegisterFormGroup.get('quantidade')?.value == undefined){
      this.TemplateRegisterFormGroup.get('quantidade')?.setValue(undefined);
      return
    }

    let value = parseInt(this.TemplateRegisterFormGroup.get('quantidade')?.value);
    let escala = this.TemplateRegisterFormGroup.get('escalaTempo')?.value == "0" ? 'dias' : 'semanas' 

    let valueAtividade = parseInt(this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.value);
    if(valueAtividade > value){
      this.AtividadeRegisterFormGroup.get('escalaTempoAtividade')?.setValue(value);
      this.toastr.warning('<small>Valor inválido: Este valor ultrapassa a quantidade máxima de '+ escala +' cadastrada para o template!</small>', 'Mensagem:');
      return
    }
  }

  //Cronograma
  lCronograma:Array<Cronograma> = [];
  lAtividadesCronograma: Array<any> = [];

  drop(event: CdkDragDrop<Cronograma[]>) {
    if(this.disabledAll){
      this.toastr.warning('Não é possível editar o cronograma em modo visualização!', 'Mensagem:');
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else if (event.previousContainer.id != "Atividades" && event.container.id != "Atividades") {
      this.toastr.warning('Para movimentar a atividade retorne-a ao quadro "Atividades" e após arraste para o período que deseja!', 'Mensagem:');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      let oldList: Array<GridAtvTarefas> = [];
      let containerId = parseInt(event.container.id);
      this.itemMovido = undefined;

      //Remover
      if (event.container.id == "Atividades") {
        containerId = parseInt(event.previousContainer.id);

        this.lCronograma[containerId].listAtividades.forEach(element => {
          oldList.push(element);
        });
  
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );    
  
        this.lAtividadesCronograma.forEach(element => {
          if(this.lCronograma[containerId].listAtividades.findIndex(x => x.position == element.position) == -1){
            this.itemMovido = element;
          }
        });

        if(this.lCronograma[containerId].listAtividades.length == 0){
          this.itemMovido = oldList[0];
        }

        this.lCronograma.forEach(element => {
          for (let index = 0; index < element.listAtividades.length; index++) {
            if(element.listAtividades[index].atividade == this.itemMovido?.atividade){
              element.listAtividades.splice(index,1);
            }
          }
        });

        return;
      }

      if(this.lAtividadesCronograma.length == 1){
        this.itemMovido = this.lAtividadesCronograma[0];
      }

      this.lAtividadesCronograma.forEach(element => {
        oldList.push(element);
      });

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      oldList.forEach(element => {
        if(this.lAtividadesCronograma.findIndex(x => x.position == element.position) == -1){
          this.itemMovido = element;
        }
      });

      let tempo = parseInt(this.itemMovido?.escalaTempoAtividade ?? '0')
      if(tempo <= (this.lCronograma.length - containerId)){
        let itensTamanho = (tempo - 1)
        for (let index = 1; index <= itensTamanho; index++) {
          this.lCronograma[containerId + index].listAtividades.push(this.itemMovido);
        }
      }
      else{
        this.toastr.warning('O periodo informado para esta atividade não é compatível com a semana escolhida!', 'Mensagem:');
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
      } 
    }
  }

  //Interação das abas
   ControleAbas(event: number){
    this.indexTab = event;
  }

  ButtonEventAba(acc: number){
    this.indexTab += acc;
    this.nav.select(this.indexTab);
  }

  compareTarefaObjects(object1: TarefaEquipe, object2: TarefaEquipe) {
    return object1 && object2 && (object1.tarefa == object2.tarefa && object1.atividade == object2.atividade);
  }
}


