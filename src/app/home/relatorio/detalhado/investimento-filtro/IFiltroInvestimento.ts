import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";

export interface IFiltroInvestimento {
    anoDe : number,
    anoAte : number,
    plano : PlanoOrcamentarioDTO[],
    unidade : UnidadeOrcamentariaDTO[],
    fonte : FonteOrcamentariaDTO,
    gnd : number,
    podeVerUnidades : boolean
}

export interface IFiltroInvestimentoComPag extends Partial<IFiltroInvestimento> {
    exercicio: number,
    pag: number, 
    pagSize: number,
}