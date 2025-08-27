import { FonteOrcamentariaDTO } from "../models/FonteOrcamentariaDTO"

export interface IVinculadaPor {
    id : number,
    fonteOrcamentaria : FonteOrcamentariaDTO,
    autorizado : number,
    dispSemReserva : number,
    empenhado : number[],
    liquidado : number[],
    pago : number[],
    orcado : number,
    gnd : number
}