import { IEtapa } from "./etapa.interface";

export interface IFluxo {
    id? : number,
    nome : string,
    etapas : IEtapa[]
}