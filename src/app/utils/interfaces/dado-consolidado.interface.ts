export interface IDadoConsolidado {
    idUnidada : string;
    unidadeResponsavel : string;
    idPO : string;
    codPO : string;
    nomePO : string;
    projEstrategico: boolean;
    contrato : string;
    anoExercicio: number;
    dadosPrevisto: IDadosValores[]
    dadosContratado: IDadosValores[]

}

interface IDadosValores {
    idFonte: string;
    nomeFonte: string;
    valor: number;
}