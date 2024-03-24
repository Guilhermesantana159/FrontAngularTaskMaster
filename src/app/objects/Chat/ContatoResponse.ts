import { EStatusContato } from "src/app/enums/EStatusContato";
import { RetornoPadrao } from "../RetornoPadrao";

export interface ContatoResponse extends RetornoPadrao
{
    data: DataContatoResponse
}

export interface DataContatoResponse
{
    nome: string,
    telefone: string,
    sobre: string,
    email: string,
    dataNascimento: string,
    foto: string | undefined,
    online: boolean,
    statusContato: EStatusContato,
    idUsuarioContato: number
    idContatoChat: number,
    mensagemNaoLida: number
}


