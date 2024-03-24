import { TarefaListResponse } from "../Tarefa/TarefaAdmResponse";

export class Column {
  constructor(public name: string,public color: string, public tasks: TarefaListResponse[]) {}
}
