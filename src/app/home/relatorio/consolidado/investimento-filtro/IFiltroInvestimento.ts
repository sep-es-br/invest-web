import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";

export interface IFiltroInvestimento {
    ano? : number,
    plano? : PlanoOrcamentarioDTO[],
    unidade? : UnidadeOrcamentariaDTO[],
    fonte? : FonteOrcamentariaDTO,
    gnd? : number,
    podeVerUnidades? : boolean
}