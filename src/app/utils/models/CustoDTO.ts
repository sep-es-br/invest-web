import { FonteOrcamentariaDTO } from "./FonteOrcamentariaDTO";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export class CustoDTO {
    
    id!: string;
    anoExercicio!: string;
    previsto!: number;
    contratado!: number;
    fonteOrcamentariaIndicadora!: FonteOrcamentariaDTO;
    unidadeOrcamentariaInformadora!: UnidadeOrcamentariaDTO;

}