import { IEtapa } from "./etapa.interface";

export interface IEmEtapa {
    id? : number;
    etapa : IEtapa;
    atividade : string,
    devolvido : boolean
}