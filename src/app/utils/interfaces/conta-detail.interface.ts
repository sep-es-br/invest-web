
export interface IContaDetail {
    id: number;
    tipo: string;
    nome: string;
    descricao: string;
    codUnidade: string;
    codPO: string;
    objetos: IObjetoTiraSimples[]
}

export interface IObjetoTiraSimples {
    id: number, 
    nome : string, 
    previsto: number, 
    contratado: number
}