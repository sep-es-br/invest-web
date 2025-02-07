import { GrupoDTO } from "../models/GrupoDTO";
import { IProfile } from "./profile.interface";

export const parecerPadrao : IParecer = {
    texto: ""
}

export interface IParecer {
    id? : string
    feitoPor?: IProfile,
    doGrupo? : GrupoDTO,
    timestamp? : string,
    texto : string
}
