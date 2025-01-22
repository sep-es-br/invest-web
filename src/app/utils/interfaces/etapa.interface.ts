import { GrupoDTO } from "../models/GrupoDTO";
import { IAcao } from "./acao.interface";

export interface IEtapa {
    id?: string,
    ordem? : number,
    nome : string,
    status : string,
    grupoResponsavel : GrupoDTO,
    acoes : IAcao[]
}