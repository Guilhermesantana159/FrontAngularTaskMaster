import { RetornoPadrao } from "../RetornoPadrao";
import { MessageChat } from "./MessageChat";

export interface MensagemChatResponse extends RetornoPadrao
{
    data: DataMensagemChatResponse
}

export interface DataMensagemChatResponse
{
    mensagemChat: Array<MessageChat>
};


