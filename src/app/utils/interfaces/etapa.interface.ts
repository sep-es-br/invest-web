import { EtapaEnum } from "../enum/etapa.enum";
import { GrupoDTO } from "../models/GrupoDTO";
import { IAcao } from "./acao.interface";

export interface IEtapa {
    id?: number,
    ordem? : number,
    nome : string,
    etapaId : string,
    grupoResponsavel : GrupoDTO,
    acoes : IAcao[]
}