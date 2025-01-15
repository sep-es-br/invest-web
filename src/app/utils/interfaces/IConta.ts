import { PlanoOrcamentarioDTO } from "../models/PlanoOrcamentarioDTO"
import { UnidadeOrcamentariaDTO } from "../models/UnidadeOrcamentariaDTO"
import { IExecucaoOrcamentaria } from "./IExecucaoOrcamentaria"
import { IObjeto } from "./IObjeto"

export interface IConta {
    id? : string,
    status? : string,
    nome? : string,
    planoOrcamentario? : PlanoOrcamentarioDTO,
    unidadeOrcamentariaImplementadora? : UnidadeOrcamentariaDTO,
    objetos? : IObjeto[] ,
    execucoesOrcamentaria? : IExecucaoOrcamentaria[]
}