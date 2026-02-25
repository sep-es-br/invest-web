import { FonteOrcamentariaDTO } from "../../../../../utils/models/FonteOrcamentariaDTO";


export interface IFonteExercicio {
    id?:string;
    fonteOrcamentaria: FonteOrcamentariaDTO,
    planejado?: number,
    contratado?: number
}