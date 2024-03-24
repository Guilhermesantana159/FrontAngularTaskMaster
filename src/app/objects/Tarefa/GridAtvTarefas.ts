import { EStatusAtividade } from "src/app/enums/EStatusAtividade";

export interface GridAtvTarefas
{
    idAtividade: number | undefined
    position: number,
    atividade: string,
    escalaTempoAtividade: string | undefined,
    dataInicial: string,
    dataFim: string,
    listTarefas: Array<any>,
    statusAtividade: EStatusAtividade | undefined
}
