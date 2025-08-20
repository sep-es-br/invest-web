import { IEtapa } from "./etapa.interface";

export interface IFluxo {
    nome : string,
    fluxoId: string,
    etapas : IEtapa[]
}