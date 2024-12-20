import { FonteOrcamentariaDTO } from "../../../../utils/models/FonteOrcamentariaDTO";

export interface IFonteExercicio {
    fonte: FonteOrcamentariaDTO,
    previsto: number,
    contratado: number
}