import { DataContatoResponse } from "./ContatoResponse";

export interface ChatContatos {
    title: string;
    contacts: Array<DataContatoResponse>;
}