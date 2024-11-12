import { FonteOrcamentariaDTO } from "./FonteOrcamentariaDTO";
import { ObjetoDTO } from "./ObjetoDTO";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export class CustoDTO {
    
    id!: string;
    anoExercicio!: string;
    previsto!: number;
    contratado!: number;
    objetoEstimado!: ObjetoDTO;
    fonteOrcamentariaIndicadora!: FonteOrcamentariaDTO;
    unidadeOrcamentariaInformadora!: UnidadeOrcamentariaDTO;

}