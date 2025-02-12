import { IModuloDTO } from "./ModuloDto"

export interface IPodeDTO {
    id : string,
    modulo : IModuloDTO,
    listar : boolean,
    visualizar : boolean,
    criar : boolean,
    editar : boolean, 
    excluir : boolean,
    verTodasUnidades : boolean
}