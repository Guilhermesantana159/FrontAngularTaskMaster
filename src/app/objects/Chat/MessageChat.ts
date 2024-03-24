export interface MessageChat {
    idMensagemChat?: number;
    align?: string;
    message?: string;
    dataCadastro?: string | null;
    replayName?:string | undefined;
    replayMessage?:string | undefined;
    statusMessage:number;
}