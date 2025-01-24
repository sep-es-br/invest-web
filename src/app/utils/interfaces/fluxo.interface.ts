import { IEtapa } from "./etapa.interface";

export interface IFluxo {
    id? : string,
    nome : string,
    etapas : IEtapa[]
}