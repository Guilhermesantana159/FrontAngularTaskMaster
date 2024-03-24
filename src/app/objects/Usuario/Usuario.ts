import { RetornoPadrao } from "../RetornoPadrao";

export interface Usuario extends RetornoPadrao
{
    data: DataUsuario
}

export interface DataUsuario
{
    nome: string,
    idUsuario: string,
    sessionKey: token,
    foto: string,
    perfil: boolean
}

export interface token
{
    acess_token: string,
    expiration: string
}