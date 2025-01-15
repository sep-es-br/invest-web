import { IVinculadaPor } from "./IVinculadaPor";

export interface IExecucaoOrcamentaria {
    id : string,
    anoExercicio : number,
    vinculadaPor : IVinculadaPor[]
}