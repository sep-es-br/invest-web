import { IOrdemItem } from "../../../../utils/interfaces/ordem-item.interface";
import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";

export interface IFiltroInvestimento {
    nome? : string,
    ano? : number,
    planos? : PlanoOrcamentarioDTO[],
    unidades? : UnidadeOrcamentariaDTO[],
    fonte? : FonteOrcamentariaDTO,
    gnd? : number,
    podeVerUnidades? : boolean,
    numPag? : number,
    qtPorPag? : number
}