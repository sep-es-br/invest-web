import { IAcao } from "./acao.interface";
import { IApontamento } from "./apontamento.interface";
import { IObjeto } from "./IObjeto";
import { IParecer } from "./parecer.interface";

interface IExecutarBase {
    acaoId : string,    
    objeto : IObjeto
}

interface IExecutarApontamentos extends IExecutarBase {
    apontamentos : IApontamento[]
}

interface IExecutarParecer extends IExecutarBase {
    parecer : IParecer
}

export type IExecutarAcao = IExecutarApontamentos | IExecutarParecer