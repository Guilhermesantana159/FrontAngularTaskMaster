import { RetornoPadrao } from "../RetornoPadrao";
import { BaseOptions } from "../Select/SelectPadrao";
import { Indicadores } from "../Tarefa/TarefaAdmResponse";

export interface ProjetoDashboard extends RetornoPadrao
{
    data: DataProjetoDashboard
}

export interface DataProjetoDashboard 
{
   lProjetos: Array<BaseOptions>,
   projeto: ProjetoDataDashboard,
   lTarefas: Array<TarefaDashboard>,
   feedback: FeedbackDataDashboard
}

export interface TarefaDashboard 
{
    projeto: string, 
    lTarefa: Array<string>,
}

export interface ProjetoDataDashboard 
{
    idProjeto: number,
    lTarefaIndicador: Indicadores,
    lAtividade: Array<AtividadeDataDashboard>
}

export interface AtividadeDataDashboard 
{
    atividade: string,
    indicador: Indicadores
    lAtividadeTarefas: Array<AtividadeTarefaDataDashboard>
}

export interface FeedbackDataDashboard 
{
    totalFeedback: number
    mediaFeedback: number
    estrela1: number
    estrela2: number
    estrela3: number
    estrela4: number
    estrela5: number
}

export interface AtividadeTarefaDataDashboard 
{
    tempoTotalTarefasEspera: number,
    tempoTotalTarefasProgresso: number,
    tempoTotalTarefasTotal: number,
    lTarefas: Array<TarefaIndicadoresDataDashboard>
}

export interface TarefaIndicadoresDataDashboard 
{
    tarefa: string,
    tempoTarefaEspera: number,
    tempoTarefaProgresso: number,
    tempoTarefaTotal: number
}




