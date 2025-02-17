import { ObjetoTiraDTO } from "./ObjetoTiraDTO";


export class InvestimentoTiraDTO {
    nome!: string;
    unidadeOrcamentaria!: string;
    codPO!: string;
    totalPrevisto!: number;
    totalContratado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    objetos!: ObjetoTiraDTO[];
}