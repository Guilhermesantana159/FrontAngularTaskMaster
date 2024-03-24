import { RetornoPadrao } from "../RetornoPadrao";
import { MovimentacoesResponse } from "./TarefasDetalhes";

export interface TarefaMovimentacaoResponse extends RetornoPadrao
{
    data: DataTarefaMovimentacaoResponse
}

export interface DataTarefaMovimentacaoResponse
{
    dataFimProjeto: string,
    nomeProjeto: string,
    dataInicioProjeto: string,
    dataFimAtividade: string,
    nomeAtividade: string,
    dataInicioAtividade: string,
    lMovimentacao: Array<MovimentacoesResponse>
}