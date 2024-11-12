import { ObjetoDTO } from "./ObjetoDTO";

export class InvestimentoDTO {
    nome!: string;
    codPO!: string;
    totalPrevisto!: number;
    totalHomologado!: number;
    totalOrcado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    objetos!: ObjetoDTO[];
}