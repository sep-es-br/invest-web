import { IVinculadaPor } from "./IVinculadaPor";

export interface IExecucaoOrcamentaria {
    id : number,
    anoExercicio : number,
    vinculadaPor : IVinculadaPor[]
}