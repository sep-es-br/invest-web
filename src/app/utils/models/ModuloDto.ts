export interface IModuloDTO {
    id : number,
    nome : string,
    pathId : string,
    filhos : IModuloDTO[]
}