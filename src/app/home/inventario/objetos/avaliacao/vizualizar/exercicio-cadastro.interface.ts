import { IFonteExercicio } from "./fonte-exercicio.interface";

export interface ICusto {
    id?: string;
    anoExercicio : number;
    indicadaPor : IFonteExercicio[];
}