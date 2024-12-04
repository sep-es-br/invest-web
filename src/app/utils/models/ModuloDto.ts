export interface IModuloDTO {
    id : string,
    nome : string,
    pathId : string,
    filhos : IModuloDTO[]
}