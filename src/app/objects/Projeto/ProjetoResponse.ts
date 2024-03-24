import { RetornoPadrao } from "../RetornoPadrao";
import { GridAtvTarefas } from "../Tarefa/GridAtvTarefas";
import { GridTarefaEquipe } from "./GridTarefaEquipe";

export interface ProjetoResponse extends RetornoPadrao
{
    data: DataProjetoResponse
}

export interface DataProjetoResponse 
{
    idProjeto: number | undefined,
    titulo: string | undefined,
    dataInicio: Date | undefined,
    dataFim: Date | undefined,
    descricao: string | undefined,
    foto: string | undefined,
    listarAtvProjeto: boolean | undefined,
    idUsuarioCadastro: number | undefined,
    dataCadastro: Date | undefined,
    status: number | undefined,
    listAtividade: Array<GridAtvTarefas>,
    listTarefa: Array<GridTarefaEquipe>;
}
