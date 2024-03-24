import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnumBase } from 'src/app/enums/EnumBase';
import { TypeFilter } from 'src/app/enums/TypeFilter';
import { GridOptions } from 'src/app/objects/Grid/GridOptions';
import { GridService } from 'src/app/components/data-grid/data-grid.service';
import { DataGridComponent } from 'src/app/components/data-grid/data-grid.component';
import { ETipoArquivo } from 'src/app/enums/ETipoArquivo';

@Component({
  selector: 'usuario-root',
  templateUrl: './usuario-grid.component.html',
  styleUrls: ['../usuario.component.css']
})

export class UsuarioComponent{
  gridOptions: GridOptions;
  optionsEnumPerfil: Array<EnumBase>;
  breadCrumbItems!: Array<{}>;

  constructor(private gridService: GridService,public gridComponent: DataGridComponent,
    private router: Router){  

    this.breadCrumbItems = [
      { label: 'Administração'},
      { label: 'Cadastros'},
      { label: 'Usuário', active: true }
    ];

    this.optionsEnumPerfil = [
      {
        Description: 'Administrador',
        Value: '0'
      },
      {
        Description: 'Comum',
        Value: '1'
      }
    ];

    this.gridOptions = {
        Parametros: {
          Controller: 'Usuario',
          Metodo: 'ConsultarGridUsuario',
          PaginatorSizeOptions: [10,50,100],
          PageSize: 10,
          MultiModal: true,
          UrlRelatorio: 'Usuario/GerarRelatorioGridUsuario',
          Modal: undefined,
          Params: {
            IdUsuario: Number.parseInt(window.localStorage.getItem('IdUsuario') ?? '1')
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
            StyleColuna: undefined,  
            StyleCell: undefined,
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
                    PropertyDisabled: 'teste'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Editar'
                }
              }
            ]  
        },
        {
          Field: 'idUsuario',
          DisplayName: 'Cód',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.Number,
          EnumName: undefined,
          Filter: true,
          OrderBy: true,
          ServerField: 'IdUsuario',
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,   
          CellGraphics: undefined,
          CellImage: undefined,
        },
        {
          Field: 'nome',
          DisplayName: 'Nome',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.String,
          EnumName: undefined,
          OrderBy: true,
          Filter: true,
          ServerField: 'Nome',
          StyleColuna: 'min-width: 45vh; max-width: 50vh;',
          EnumOptions: [],
          StyleCell: 'margin-left:5pt; padding: 3pt; border-radius: 2pt;',
          ClassCell: 'd-inline',
          CellGraphics: undefined,
          CellImage: {
            PropertyLink: 'imagemUsuario',
            ClassImage: 'rounded float-start d-inline',
            StyleImage: 'max-width: 30pt;',
            Tooltip:  'Foto do usuário',
            OnlyImage: false
          },    
        },
        {
          Field: 'email',
          DisplayName: 'Email',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'Email',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 45vh; max-width: 50vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,    
        },
        {
          Field: 'cpf',
          DisplayName: 'CPF',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'CPF',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 25vh; max-width: 30vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,           
        },
        {
          Field: 'dataNascimento',
          DisplayName: 'Data de nascimento',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Data,
          EnumName: undefined,
          ServerField: 'dataNascimento',
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
          Field: 'perfil',
          DisplayName: 'Perfil',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Enum,
          EnumName: undefined,
          ServerField: 'perfilAdministrador',
          Filter: false,
          OrderBy: false,
          StyleColuna: 'min-width: 25vh; max-width: 30vh;',
          EnumOptions: this.optionsEnumPerfil,
          StyleCell: undefined,
          ClassCell: undefined,
          CellGraphics: undefined,
          CellImage: undefined,  
        }
      ]
    }
  }

  RecarregarGrid(){
    this.gridService.RecarregarGrid();
  }

  Editar(data: any){
    this.router.navigate(['main-dashboard/entities/usuario/' + data.idUsuario.toString() + '/editar']);
  }

  GerarRelatorio(tipo: ETipoArquivo){
    this.gridService.EmitirRelatorio(tipo);
  }
  
};


