export interface IDadoDetalhado {
    idUnidade : number;
    unidadeResponsavel : string;
    idPO : number;
    codPO : string;
    nomePO : string;
    projEstrategico: boolean;
    contrato : string;
    anoExercicio: number;
    valores: IDadosValores[];

}

interface IDadosValores {
    idFonte: number;
    nomeFonte: string;
    valorPlanejado: number;
    valorContratado: number;
}