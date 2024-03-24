import { RetornoPadrao } from "../RetornoPadrao";
import { DataContatoResponse } from "./ContatoResponse";

export interface ChatContatoResponse extends RetornoPadrao
{
    data: DataChatContatoResponse
}

export interface DataChatContatoResponse
{
    lContatos: Array<DataContatoResponse>;
}


