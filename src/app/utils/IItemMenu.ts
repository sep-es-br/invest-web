export interface IItemMenu {
    titulo?: string,
    icone?: string,
    ativo: boolean,
    link? : string,
    subItens? : IItemMenu[]
}