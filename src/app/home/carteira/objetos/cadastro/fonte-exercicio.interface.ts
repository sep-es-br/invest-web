import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";

export interface IFonteExercicio {
    id?:string;
    fonteOrcamentaria: FonteOrcamentariaDTO,
    previsto?: number,
    contratado?: number,
    gnd : number
}