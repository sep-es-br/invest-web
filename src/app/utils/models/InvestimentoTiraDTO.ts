import { ObjetoTiraDTO } from "./ObjetoTiraDTO";


export class InvestimentoTiraDTO {
    nome!: string;
    unidadeOrcamentaria!: string;
    codPO!: string;
    totalPrevisto!: number;
    totalHomologado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    objetos!: ObjetoTiraDTO[];
}