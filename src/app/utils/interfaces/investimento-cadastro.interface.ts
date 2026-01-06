import { IObjetoCadastroForm } from "./objeto-cadastro-form.interface";

export interface IInvestimentoCadastro {
    id: number,
    tipo: string,
    nome: string,
    descricao: string,
    codUnidade: string,
    siglaUnidade: string,
    codPo: string,
    nomePo: string,
    objetos: IObjetoCadastroForm[]
}