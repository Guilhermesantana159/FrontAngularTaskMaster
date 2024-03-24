export interface GridTarefaEquipe
{
    position: number,
    idResponsavel: number,
    responsavel: string;
    listTarefas: Array<TarefaEquipe>
}

export interface TarefaEquipe
{
    atividade: string,
    tarefa: string,
}
