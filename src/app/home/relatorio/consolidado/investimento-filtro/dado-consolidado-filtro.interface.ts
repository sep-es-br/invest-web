import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";
import { PlanoOrcamentarioDTO } from "../../../../utils/models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../../../../utils/models/UnidadeOrcamentariaDTO";

export interface IDadoConsolidadoFiltro {
    anoDe : number,
    anoAte : number,
    unidade : UnidadeOrcamentariaDTO[],
    fonte : FonteOrcamentariaDTO,
    gnd : number,
    podeVerUnidades : boolean
}

export interface IDadoConsolidadoFiltroComPag extends Partial<IDadoConsolidadoFiltro> {
    pag: number, 
    pagSize: number,
}