import { RetornoPadrao } from "../RetornoPadrao";
import { ResponsavelTarefa } from "./TarefaAdmResponse";

export interface TarefaDetalhesResponse extends RetornoPadrao
{
    data: DataTarefaDetalhesResponse
}

export interface DataTarefaDetalhesResponse
{
    tempoUtilizado:string,
    titulo:string,
    codTarefa:string,
    nomeProjeto:string,
    nomeAtividade: string,
    prioridade: string,
    status: string,
    dataFim: string,
    isView: boolean,
    descricaoTarefa: string,
    lTags: Array<string>,
    responsavelTarefa: Array<ResponsavelTarefa>,
    lComentarios: Array<ComentarioTarefaResponse>,
    lMovimentacoes: Array<MovimentacoesResponse>
}

export interface ComentarioTarefaResponse
{
    foto: string,
    nomeUsuario: string,
    horario: string,
    comentario: string
}

export interface MovimentacoesResponse
{
    foto: string,
    nomeUsuario: string,
    tarefaNome: string,
    dataMovimentacao: string,
    comentario: string,
    tempoColuna: string,
    de: string,
    para: string,
    dataMovimentacaoFormatDate: string
}