import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO";
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO";
import { IStatus } from "./status.interface";

export interface IObjetoFiltro {
    nome? : string;
    unidade? : UnidadeOrcamentariaDTO,
    plano? : PlanoOrcamentarioDTO,
    exercicio? : number,
    status? : IStatus,
}