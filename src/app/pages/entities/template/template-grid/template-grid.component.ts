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
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'template-root',
  templateUrl: './template-grid.component.html',
  styleUrls: ['../template.component.css']
})

export class TemplateComponent{
  gridOptions: GridOptions;
  breadCrumbItems!: Array<{}>;

  constructor(private gridService: GridService,public gridComponent: DataGridComponent,private toastr: ToastrService,
    private router: Router,private response: BaseService,private formBuilder: FormBuilder){  

    this.breadCrumbItems = [
      { label: 'Projeto'},
      { label: 'Cadastros'},
      { label: 'Template', active: true }
    ];

    this.gridOptions = {
        Parametros: {
          Controller: 'Template',
          Metodo: 'ConsultarGridTemplate',
          PaginatorSizeOptions: [10,50,100],
          PageSize: 10,
          MultiModal: false,
          UrlRelatorio: '',
          Modal: undefined,
          Params: {
            IdUsuario: window.localStorage.getItem('IdUsuario')
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
            StyleColuna: 'min-width: 20vh; max-width: 25vh;',
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
                    PropertyDisabled: 'isView'
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
                    PropertyDisabled: 'isEdit'
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
                TypeActionButton: 4,
                TypeButton: 1,
                ParametrosAction: {
                  Conteudo: '<i class="ri-delete-bin-5-line"></i>',
                  ClassProperty: 'btn btn-sm btn-outline-danger waves-effect waves-light',
                  Disabled: {
                    Disabled: undefined,
                    PropertyDisabled: 'isView'
                  },
                  Hidden: {
                    Hidden: false,
                    PropertyHidden: ''
                  },
                  Target: undefined,
                  Href: undefined,
                  Tooltip: 'Deletar'
                }
              }
            ]  
        },
        {
          Field: 'idTemplate',
          DisplayName: 'Cód template',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.Number,
          EnumName: undefined,
          Filter: true,
          OrderBy: true,
          ServerField: 'IdTemplate',
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
          StyleCell: undefined,
          ClassCell: undefined,   
          CellGraphics: undefined,
          CellImage: undefined,
        },
        {
          Field: 'tituloTemplate',
          DisplayName: 'Template',
          CellTemplate: undefined,
          ActionButton: undefined,
          Type: TypeFilter.String,
          EnumName: undefined,
          OrderBy: true,
          Filter: true,
          ServerField: 'titulo',
          StyleColuna: 'min-width: 35vh; max-width: 45vh;',
          EnumOptions: [],
          StyleCell: 'margin-left:5pt; padding: 3pt; border-radius: 2pt;',
          ClassCell: 'd-inline',
          CellGraphics: undefined,
          CellImage: {
            PropertyLink: 'fotoTemplate',
            ClassImage: 'rounded float-start d-inline',
            StyleImage: 'max-width: 30pt;',
            Tooltip:  '',
            OnlyImage: false
          },    
        },
        {
          Field: 'duracao',
          DisplayName: 'Duração estimada template do projeto',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.Number,
          EnumName: undefined,
          ServerField: 'quantidadeTotal',
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
          Field: 'categoria',
          DisplayName: 'Categoria do template',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'categoriaTemplate.Descricao',
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
          Field: 'autor',
          DisplayName: 'Autor do template',
          CellTemplate: undefined,
          ActionButton: undefined, 
          Type: TypeFilter.String,
          EnumName: undefined,
          ServerField: 'usuarioCadastro.Nome',
          Filter: true,
          OrderBy: true,
          StyleColuna: 'min-width: 20vh; max-width: 25vh;',
          EnumOptions: [],
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
    this.router.navigate(['main-dashboard/entities/template/' + data.idTemplate.toString() + '/editar']);
  }

  Visualizar(data: any){
    this.router.navigate(['main-dashboard/entities/template/' + data.idTemplate.toString() + '/ver']);
  }

  Deletar(data: any){
    this.response.Post("Template","DeletarTemplate/" + data.idTemplate,{}).subscribe(
      (response: RetornoPadrao) =>{        
        if(response.sucesso){
          this.toastr.success(response.mensagem, 'Mensagem:');
        }else{
          this.toastr.error(response.mensagem, 'Mensagem:');
        }

        this.gridService.RecarregarGrid();

      });
  }

};


