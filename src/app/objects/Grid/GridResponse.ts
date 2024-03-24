import { RetornoPadrao } from "../RetornoPadrao";

export interface ResponseData extends RetornoPadrao
{
    data: GridResponse
}

export interface GridResponse{
    totalItens: number,
    itens: Array<any>,
}