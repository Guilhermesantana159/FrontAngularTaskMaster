import { EActionButton } from "src/app/enums/EActionButton"
import { EnumBase } from "src/app/enums/EnumBase"
import { TypeActionButton } from "src/app/enums/TypeActionButton"
import { TypeFilter } from "src/app/enums/TypeFilter"

export interface GridOptions{
    Parametros: Parametros,
    Colunas: Array<Coluna>
}

export interface Parametros{
    Controller: string,
    Metodo: string,
    UrlRelatorio: string,
    MultiModal: boolean,
    Modal: {
        SelectedValue: string,
        SelectedText: string
    } | undefined
    PaginatorSizeOptions: Array<number> | undefined,
    PageSize: number | undefined,
    Params: any | undefined
}

export interface Coluna{
    Field: string,
    DisplayName: string,
    CellTemplate: string | undefined,
    ActionButton: Array<Action> | undefined,
    Type: TypeFilter,
    EnumOptions: Array<EnumBase>,
    EnumName: string | undefined,
    Filter: boolean,
    OrderBy: boolean,
    ServerField: string,
    StyleColuna: string | undefined
    StyleCell: string | undefined
    ClassCell: string | undefined
    CellGraphics: {
        PropertyLink: string,
        Tooltip: string,
        OnlyGraphics: boolean,
        ClassGraphics: string,
        StyleGraphics: string | undefined,
    } | undefined
    CellImage: {
        PropertyLink: string,
        ClassImage: string,
        StyleImage: string | undefined,
        Tooltip: string,
        OnlyImage: boolean
    } | undefined
}

export interface Action{
    TypeActionButton: TypeActionButton,
    TypeButton: EActionButton
    ParametrosAction: ParametrosAction
}

export interface ParametrosAction{
    ClassProperty: string | undefined,
    Disabled: DisabledProperty,
    Hidden: HiddenProperty,
    Target: string | undefined,
    Href: string | undefined,
    Conteudo: string,
    Tooltip: string
}

export interface DisabledProperty{
    Disabled: boolean | undefined
    PropertyDisabled: string 
}

export interface HiddenProperty{
    Hidden: boolean | undefined
    PropertyHidden: string 
}

