import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TypeFilter } from 'src/app/enums/TypeFilter';
import { BaseService } from 'src/factorys/services/base.service';
import { DataGridComponent } from 'src/app/components/data-grid/data-grid.component';
import { GridService } from 'src/app/components/data-grid/data-grid.service';
import { GridOptions } from 'src/app/objects/Grid/GridOptions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kamban-tarefas-grid-root',
  templateUrl: './kamban-tarefas-grid.component.html',
  styleUrls: ['../kamban-tarefas.component.scss']
})

export class KambamGridTarefasComponent{
  gridOptions: GridOptions;
  breadCrumbItems!: Array<{}>;

  constructor(private gridService: GridService,public gridComponent: DataGridComponent,private toastr: ToastrService,
    private router: Router,private response: BaseService){  

    this.breadCrumbItems = [
      { label: 'Atividades'},
      { label: 'Tarefas'},
      { label: 'Registro', active: true }
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
            IdUsuario: parseInt(window.localStorage.getItem('IdUsuario') ?? '0'),
            OnlyAbertos: true,
            OnlyAdmin: false
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
            StyleColuna: 'min-width: 10vh; max-width: 15vh;',
            StyleCell: "display: inline-block;padding: 2pt;",
            ClassCell: undefined,
            CellGraphics: undefined,
            CellImage: undefined,
            ActionButton: [
              {
                TypeActionButton: 0,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class=" ri-booklet-line"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-info waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: ''
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Ver minhas atividades'
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
          Field: 'administrador',
          DisplayName: 'Gerente do projeto',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'administrador',
          Filter: false,
          OrderBy: false,
          StyleColuna: 'min-width: 30vh',
          EnumOptions: [],
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
    this.router.navigate(['/main-dashboard/entities/kamban-tarefas/' + data.idProjeto.toString() + '/registro']);
  }
};


