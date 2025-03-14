export interface IDadoConsolidado {
    idUnidade : string;
    unidadeResponsavel : string;
    idPO : string;
    codPO : string;
    nomePO : string;
    projEstrategico: boolean;
    contrato : string;
    anoExercicio: number;
    valores: IDadosValores[];

}

interface IDadosValores {
    idFonte: string;
    nomeFonte: string;
    valorPrevisto: number;
    valorContratado: number;
}