import { Injectable } from '@angular/core';
import { TypeFilter } from 'src/app/enums/TypeFilter';

@Injectable({
    providedIn: 'root'
})

export class DefaultService{
    public OptionSelect = {
      TipoUsuario: [
        {
          Description: 'Administrador',
          Value: '0'
        },
        {
          Description: 'Comum',
          Value: '1'
        }
      ]
    };

    public Modal = {
      ConsultaPadraoTemplate: {
            Parametros: {
                Controller: 'Template',
                Metodo: 'ConsultarGridTemplate',
                PaginatorSizeOptions: [10,50,100],
                UrlRelatorio: '',
                MultiModal: false,
                Modal: {
                  SelectedText: 'tituloTemplate',
                  SelectedValue: 'idTemplate'
                },
                PageSize: 5,
                Params: undefined
              },
              Colunas: [
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
        },
        ConsultaPadraoUsuario: {
            Parametros: {
                Controller: 'Usuario',
                Metodo: 'ConsultarGridUsuario',
                PaginatorSizeOptions: [10,50,100],
                UrlRelatorio: '',
                MultiModal: false,
                Modal: {
                  SelectedText: 'nome',
                  SelectedValue: 'idUsuario'
                },
                PageSize: 5,
                Params: undefined
              },
              Colunas: [
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
                StyleColuna: undefined,
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
                StyleColuna: 'min-width: 40vh; max-width: 50vh;',
                EnumOptions: [],
                StyleCell: 'margin-left:5pt; padding: 2pt; border-radius: 2pt; background: rgb(40,167,69);',
                ClassCell: 'd-inline text-white',
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
                Field: 'cpf',
                DisplayName: 'CPF',
                CellTemplate: undefined,
                ActionButton: undefined,
                Type: TypeFilter.String,
                EnumName: undefined,
                OrderBy: true,
                Filter: true,
                ServerField: 'CPF',
                StyleColuna: 'min-width: 20vh; max-width: 30vh;',
                EnumOptions: [],
                StyleCell: undefined,
                ClassCell: undefined,
                CellGraphics: undefined,
                CellImage: undefined    
              }
            ]
        },
        ConsultaPadraoUsuarioMulti: {
          Parametros: {
              Controller: 'Usuario',
              Metodo: 'ConsultarGridUsuario',
              PaginatorSizeOptions: [10,50,100],
              UrlRelatorio: '',
              MultiModal: true,
              Modal: {
                SelectedText: 'nome',
                SelectedValue: 'idUsuario'
              },
              PageSize: 5,
              Params: undefined
            },
            Colunas: [
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
              StyleColuna: undefined,
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
              StyleColuna: 'min-width: 40vh; max-width: 50vh;',
              EnumOptions: [],
              StyleCell: 'margin-left:5pt; padding: 2pt; border-radius: 2pt; background: rgb(40,167,69);',
              ClassCell: 'd-inline text-white',
              CellGraphics: undefined,
              CellImage: {
                PropertyLink: 'imagemUsuario',
                ClassImage: 'rounded float-start d-inline',
                StyleImage: 'max-width: 30pt;',
                Tooltip:  'Foto do usuário',
                OnlyImage: false
              },    
            }
          ]
      },
    }
};