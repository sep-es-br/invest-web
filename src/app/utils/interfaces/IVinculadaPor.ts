import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO"

export interface IVinculadaPor {
    id : string,
    fonteOrcamentaria : FonteOrcamentariaDTO,
    autorizado : number,
    dispSemReserva : number,
    empenhado : number[],
    liquidado : number[],
    pago : number[],
    orcado : number
}