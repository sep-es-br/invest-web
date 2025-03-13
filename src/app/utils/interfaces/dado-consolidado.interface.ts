export interface IDadoConsolidado {
    idUnidada : string;
    unidadeResponsavel : string;
    idPO : string;
    codPO : string;
    nomePO : string;
    projEstrategico: boolean;
    contrato : string;
    anoExercicio: number;
    dadosPrevisto: {
        idFonte: string;
        nomeFonte: string;
        valor: number;
    }[]
    dadosContratado: {
        idFonte: string;
        nomeFonte: string;
        valor: number;
    }[]

}