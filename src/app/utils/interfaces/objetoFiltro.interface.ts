import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";

export interface IObjetoFiltro {
    nome? : string;
    unidade? : UnidadeOrcamentariaDTO,
    plano? : PlanoOrcamentarioDTO,
    exercicio? : number,
    status? : string,
}