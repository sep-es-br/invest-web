export class ObjetoTiraDTO {
    id? : number;
    unidadeResponsavel!: string;
    codPO : string;
    nome!: string;
    tipo!: string;
    totalPlanejado!: number;
    totalContratado!: number;
    totalAutorizado! : number;
    totalEmpenhado: number
    totalDisponivel! : number;
    status : string;
}