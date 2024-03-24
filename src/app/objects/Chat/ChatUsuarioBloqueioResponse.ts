import { RetornoPadrao } from "../RetornoPadrao";

export interface ChatUsuarioBloqueioResponse extends RetornoPadrao
{
    data: DataChatUsuarioBloqueioResponse
}

export interface DataChatUsuarioBloqueioResponse
{
    listChatBloqueio: Array<DataUsuarioBloqueio>;
}

export interface DataUsuarioBloqueio
{
    idBloqueador: number,
    idBloqueado: number
}
