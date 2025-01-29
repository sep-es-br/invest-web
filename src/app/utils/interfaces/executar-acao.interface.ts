import { IAcao } from "./acao.interface";
import { IApontamento } from "./apontamento.interface";
import { IObjeto } from "./IObjeto";

export interface IExecutarAcao {
    acao : IAcao,
    apontamentos : IApontamento[],
    objeto : IObjeto
}