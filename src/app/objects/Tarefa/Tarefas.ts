export interface Tarefa
{
    descricao: string,
    idTarefa: number | undefined,
    prioridade: string,
    lTagsTarefa: Array<string>,
    descricaoTarefa: string | undefined
}