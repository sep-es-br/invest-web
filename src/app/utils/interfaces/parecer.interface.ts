import { GrupoDTO } from "../models/GrupoDTO";
import { IProfile } from "./profile.interface";

export const parecerPadrao : IParecer = {
    texto: ""
}

export interface IParecer {
    id? : number
    feitoPor?: IProfile,
    doGrupo? : GrupoDTO,
    timestamp? : string,
    texto : string
}
