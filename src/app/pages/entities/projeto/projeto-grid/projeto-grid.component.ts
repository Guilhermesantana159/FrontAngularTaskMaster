import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnumBase } from 'src/app/enums/EnumBase';
import { TypeFilter } from 'src/app/enums/TypeFilter';
import { ETipoArquivo } from '../../../../enums/ETipoArquivo';
import { BaseService } from 'src/factorys/services/base.service';
import { DataGridComponent } from 'src/app/components/data-grid/data-grid.component';
import { GridService } from 'src/app/components/data-grid/data-grid.service';
import { RetornoPadrao } from 'src/app/objects/RetornoPadrao';
import { GridOptions } from 'src/app/objects/Grid/GridOptions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'projeto-root',
  templateUrl: './projeto-grid.component.html',
  styleUrls: ['../projeto.component.css']
})

export class ProjetoComponent{
  gridOptions: GridOptions;
  statusEnumProjeto: Array<EnumBase>;
  breadCrumbItems!: Array<{}>;

  constructor(private gridService: GridService,public gridComponent: DataGridComponent,private toastr: ToastrService,
    private router: Router,private response: BaseService){  

    this.breadCrumbItems = [
      { label: 'Projeto'},
      { label: 'Cadastros'},
      { label: 'Projeto', active: true }
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
            StyleColuna: 'min-width: 30vh; max-width: 35vh;',
            StyleCell: "display: inline-block;padding: 2pt;",
            ClassCell: undefined,
            CellGraphics: undefined,
            CellImage: undefined,
            ActionButton: [
              {
                TypeActionButton: 0,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-ball-pen-fill"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-info waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'actionDisabled'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Editar'
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
              },
              {
                TypeActionButton: 2,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-check-double-line"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-success waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'actionDisabled'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Concluir'
                }
              },
              {
                TypeActionButton: 4,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-delete-bin-5-line"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-danger waves-effect waves-light',
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
                  Tooltip: 'Deletar'
                }
              },
              {
                TypeActionButton: 3,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-close-circle-fill"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-danger waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'actionDisabled'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Cancelar'
                }
              }
            ]  
        },
        {
          Field: 'idProjeto',
          DisplayName: 'Cód projeto',
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
          DisplayName: 'Projeto',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.String,
          EnumName: undefined,
          OrderBy: true,
          Filter: true,
          ServerField: 'Titulo',
          StyleColuna: 'min-width: 35vh; max-width: 45vh;',
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
    this.router.navigate(['main-dashboard/entities/projeto/' + data.idProjeto.toString() + '/editar']);
  }

  Concluir(data: any){
    this.response.Post("Projeto","MudarStatusProjeto",{Status: 2,IdProjeto: data.idProjeto}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }

        this.gridService.RecarregarGrid();

      });
  }

  Encerrar(data: any){
    this.response.Post("Projeto","MudarStatusProjeto",{Status: 1,IdProjeto: data.idProjeto}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');

        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }

        this.gridService.RecarregarGrid();

      });
  }

  Deletar(data: any){
    this.response.Post("Projeto","Deletar",{IdProjeto: data.idProjeto}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }

        this.gridService.RecarregarGrid();

      });
  }

  GerarRelatorio(tipo: ETipoArquivo){
    this.gridService.EmitirRelatorio(tipo);
  }
};


