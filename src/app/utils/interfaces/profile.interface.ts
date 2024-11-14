import { IAvatar } from "./avatar.interface";
import { IFuncao } from "./funcao.interface";

export interface IProfile {
    token: string;
    id: string | null;
    imgPerfil: IAvatar;
    name: string;
    sub: string;
    email: string;
    cpf: string;
    role: IFuncao[];
}

