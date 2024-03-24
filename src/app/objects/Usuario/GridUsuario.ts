import { RetornoPadrao } from "../RetornoPadrao";

export interface GridUsuario extends RetornoPadrao
{
    data: Itens
}

export interface Itens{
    itens: Array<DataGridUsuario>
}

export interface DataGridUsuario
{
    nome: string
}

