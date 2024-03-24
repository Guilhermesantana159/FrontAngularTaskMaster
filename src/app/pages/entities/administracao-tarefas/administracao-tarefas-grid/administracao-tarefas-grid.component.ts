import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TypeFilter } from 'src/app/enums/TypeFilter';
import { GridOptions } from 'src/app/objects/Grid/GridOptions';
import { GridService } from 'src/app/components/data-grid/data-grid.service';
import { DataGridComponent } from 'src/app/components/data-grid/data-grid.component';
import { BaseService } from 'src/factorys/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { EnumBase } from 'src/app/enums/EnumBase';

@Component({
  selector: 'administracao-tarefas-root',
  templateUrl: 'administracao-tarefas-grid.component.html',
  styleUrls: ['../administracao-tarefas.component.css']
})

export class AdministracaoTarefasComponent{
  gridOptions: GridOptions;
  statusEnumProjeto: Array<EnumBase>;
  breadCrumbItems!: Array<{}>;

  constructor(private gridService: GridService,public gridComponent: DataGridComponent,private toastr: ToastrService,
    private router: Router,private response: BaseService){  

    this.breadCrumbItems = [
      { label: 'Atividades'},
      { label: 'Tarefas'},
      { label: 'Administração de tarefas', active: true }
    ];

    this.statusEnumProjeto = [
      {
        Description: 'Aberto',
        Value: '0'
      },
      {
        Description: 'Cancelado',
        Value: '1'
      },
      {
        Description: 'Concluido',
        Value: '2'
      },
      {
        Description: 'Atrasado',
        Value: '3'
      }
    ];

    this.gridOptions = {
        Parametros: {
          Controller: 'Projeto',
          Metodo: 'ConsultarGridProjeto',
          PaginatorSizeOptions: [10,50,100],
          PageSize: 10,
          MultiModal: false,
          UrlRelatorio: 'Projeto/GerarRelatorioGridProjeto',
          Modal: undefined,
          Params: {
            IdUsuario: window.localStorage.getItem('IdUsuario'),
            OnlyAbertos: false,
            OnlyAdmin: true
          }
        },
        Colunas: [{
            Field: 'Action',
            DisplayName: 'Ações',
            CellTemplate: undefined,
            Type: TypeFilter.none,
            Filter: false,
            OrderBy: false,
            EnumName: undefined,
            ServerField: '',
            EnumOptions: [],  
            StyleColuna: 'min-width: 15vh; max-width: 20vh;',
            StyleCell: "display: inline-block;padding: 2pt;",
            ClassCell: undefined,
            CellGraphics: undefined,
            CellImage: undefined,
            ActionButton: [
              {
                TypeActionButton: 0,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-question-answer-fill"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-info waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'disabledAdminister'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Gerenciar tarefas deste projeto'
                }
              },
              {
                TypeActionButton: 0,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-eye-line"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-success waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'disabledView'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Ver'
                }
              }
            ]  
        },
        {
          Field: 'idProjeto',
          DisplayName: 'Cód',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.Number,
          EnumName: undefined,
          Filter: true,
          OrderBy: true,
          ServerField: 'IdProjeto',
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,   
          CellGraphics: undefined,
          CellImage: undefined,
        },
        {
          Field: 'titulo',
          DisplayName: 'Titulo',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.String,
          EnumName: undefined,
          OrderBy: true,
          Filter: true,
          ServerField: 'Titulo',
          StyleColuna: 'min-width: 40vh; max-width: 45vh;',
          EnumOptions: [],
          StyleCell: 'margin-left:5pt; padding: 3pt; border-radius: 2pt;',
          ClassCell: 'd-inline',
          CellGraphics: undefined,
          CellImage: {
            PropertyLink: 'fotoProjeto',
            ClassImage: 'rounded float-start d-inline',
            StyleImage: 'max-width: 30pt;',
            Tooltip:  'Representação do projeto',
            OnlyImage: false
          },    
        },
        {
          Field: 'dataInicio',
          DisplayName: 'Data de início',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Data,
          EnumName: undefined,
          ServerField: 'DataInicio',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,    
        },
        {
          Field: 'dataFim',
          DisplayName: 'Data de conclusão',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Data,
          EnumName: undefined,
          ServerField: 'DataFim',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,    
        },
        {
          Field: 'status',
          DisplayName: 'Status Projeto',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Enum,
          EnumName: undefined,
          ServerField: 'Status',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: this.statusEnumProjeto,
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,  
        },
        {
          Field: 'porcentagem',
          DisplayName: 'Andamento do projeto',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'porcentagem',
          Filter: false,
          OrderBy: false,
          StyleColuna: 'min-width: 40vh',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: {  
            PropertyLink: 'porcentagem',
            Tooltip: '%',
            OnlyGraphics: true,
            ClassGraphics: '',
            StyleGraphics: undefined
          },
          CellImage: undefined,  
        }
      ]
    }
  }

  RecarregarGrid(){
    this.gridService.RecarregarGrid();
  }

  Editar(data: any){
    this.router.navigate(['/main-dashboard/entities/administracao-tarefas/' + data.idProjeto.toString()]);
  }
};


