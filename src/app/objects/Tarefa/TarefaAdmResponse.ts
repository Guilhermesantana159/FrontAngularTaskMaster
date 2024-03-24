import { RetornoPadrao } from "../RetornoPadrao";

export interface TarefaAdmResponse extends RetornoPadrao
{
    data: DataTarefaAdmResponse
}

export interface DataTarefaAdmResponse
{
    listAtividade: Array<AtividadeResponse>
    indicadores: Indicadores, 
    isView: boolean, 
    listTarefas: Array<TarefaListResponse> 
}

export interface Indicadores
{
    tarefasFazer: number,
    tarefasProgresso: number,
    tarefasCompletas: number,
    tarefasAtrasadas: number
}

export interface TarefaListResponse
{
    idTarefa: number,
    idAtividade: number,
    nomeAtividade: string,
    nomeTarefa: string,
    dataInicio: string,
    dataFim: string,
    lResponsavelTarefa: Array<ResponsavelTarefa>,
    prioridade: string,
    status: string,
    permiteInicio: boolean,
    lTags: Array<string>,
    descricaoTarefa: string,
    statusEnum: number,
    porcentagem: number,
    prioridadeEnum: number
}

export interface ResponsavelTarefa
{
    foto: string,
    nome: string,
    idUsuario: number
}

export interface AtividadeResponse
{
    lTarefas: Array<string>
    nome: string,
    idAtividade: number
}
