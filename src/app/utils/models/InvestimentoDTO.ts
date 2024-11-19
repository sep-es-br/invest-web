import { ObjetoDTO } from "./ObjetoDTO";

export class InvestimentoDTO {
    nome!: string;
    unidadeOrcamentaria!: string;
    codPO!: string;
    totalPrevisto!: number;
    totalHomologado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    objetos!: ObjetoDTO[];
}