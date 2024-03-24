import { GridOptions } from "../Grid/GridOptions";

export interface ConsultaModalParams 
{
    Label: string,
    Title: string,
    Disabled: boolean,
    Class: string,
    Required: boolean,
    GridOptions: GridOptions,
    OnlyButton: boolean,
    SelectedText: string,
    SelectedValue: string 
}

