import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";

export interface IObjetoFiltro {
    unidade? : UnidadeOrcamentariaDTO,
    plano? : PlanoOrcamentarioDTO,
    exercicio? : number
}