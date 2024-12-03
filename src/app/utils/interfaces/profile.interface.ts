
import { GrupoDTO } from "../models/GrupoDTO";
import { IAvatar } from "./avatar.interface";
import { IFuncao } from "./funcao.interface";

export interface IProfile {
    token: string;
    id: string | null;
    imgPerfil: IAvatar;
    name: string;
    nomeCompleto: string;
    sub: string;
    email: string;
    telefone: string;
    papel : string;
    role: IFuncao[];

    grupos : GrupoDTO[]
}

