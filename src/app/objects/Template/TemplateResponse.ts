import { RetornoPadrao } from "../RetornoPadrao";

export interface TemplateResponse extends RetornoPadrao
{
    data: DataTemplateResponse
}

export interface DataTemplateResponse
{
    idTemplate: number | undefined,
    titulo: string;
    descricao: string;
    quantidade: number;
    categoria: string;
    escalaTempo: string,
    descricaoCategoriaNova: string | undefined,
    idUsuarioCadastro: number,
    lAtividade: Array<AtividadeTemplateResponse>,
    foto: string | undefined,
    isView: boolean 
}


export interface AtividadeTemplateResponse
{
    tempoPrevisto: number,
    idTemplate: number | undefined,
    titulo: string,
    posicao: number,
    lTarefaTemplate: Array<TarefaTemplateResponse>
}

export interface  TarefaTemplateResponse
{
    descricao: string;
    descricaoTarefa: string;
    prioridade: string,
    lTagsTarefa: Array<string>
}

