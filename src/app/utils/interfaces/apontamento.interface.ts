import { GrupoDTO } from "../models/GrupoDTO";
import { ICampo } from "./campo.interface";
import { IEtapa } from "./etapa.interface";
import { IProfile } from "./profile.interface";

export interface IApontamento {
    id? : string;
    timestamp? : string;
    texto : string;
    etapa? : IEtapa;
    campo : ICampo;
    usuario? : IProfile;
    grupo? : GrupoDTO;
}

export const apontamentoPadrao : IApontamento = {
    campo: undefined,
    texto: undefined
}

