import { EStatusAtividade } from "src/app/enums/EStatusAtividade";
import { Tarefa } from "../Tarefa/Tarefas";

export interface ProjetoRequest
{
    IdProjeto: number | undefined,
    Titulo: string,
    DataInicio: string,
    DataFim: string,
    Descricao: string | undefined,
    EmailProjetoAtrasado: boolean,
    PortalProjetoAtrasado: boolean,
    EmailTarefaAtrasada: boolean,
    PortalTarefaAtrasada: boolean,
    AlteracaoStatusProjetoNotificar: boolean,
    AlteracaoTarefasProjetoNotificar: boolean,
    Atividade: Array<AtividadeRequest>, 
    IdUsuarioCadastro: number,
    Tarefa: Array<any>,
    Foto: string | undefined
}

export interface AtividadeRequest
{
    IdAtividade: number | undefined,
    Atividade: string,
    DataInicial: Date | undefined,
    DataFim: Date | undefined,
    ListTarefas: Array<Tarefa>
    StatusAtividade: EStatusAtividade
}
