import { RetornoPadrao } from "../RetornoPadrao";

export interface CronogramaResponse extends RetornoPadrao
{
    data: DataCronogramaResponse
}

export interface DataCronogramaResponse
{
    descricaoProjeto: string;
    dataInicio: string;
    dataFim: string;
    lAtividadeCronograma: Array<AtividadeCronograma>;
}

export interface AtividadeCronograma
{
    idAtividade: number;
    dataInicio: string;
    dataFim: string;
    nomeAtividade: string;
}

