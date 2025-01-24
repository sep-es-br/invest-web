export class ObjetoTiraDTO {
    id? : string;
    unidadeResponsavel!: string;
    codPlano : string;
    nome!: string;
    tipo!: string;
    totalPrevisto!: number;
    totalHomologado!: number;
    totalAutorizado! : number;
    totalDisponivel! : number;
    status : string;
}