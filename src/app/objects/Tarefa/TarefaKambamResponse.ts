import { RetornoPadrao } from "../RetornoPadrao";
import { TarefaListResponse } from "./TarefaAdmResponse";

export interface TarefaKambamResponse extends RetornoPadrao
{
    data: DataTarefaKambamResponse
}

export interface DataTarefaKambamResponse
{
    listTarefas: Array<TarefaListResponse>,
}

