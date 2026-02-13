import { ObjetoTiraDTO } from "./ObjetoTiraDTO";


export class InvestimentoTiraDTO {
    nome!: string;
    unidadeOrcamentaria!: string;
    codPO!: string;
    totalPlanejado!: number;
    totalContratado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    totalEmpenhado: number;
    objetos!: ObjetoTiraDTO[];
}