import { ISetorDTO } from "./SetorDTO"

export interface IOrgaoDTO {
    id : string,
    guid : string,
    sigla : string,
    nome : string,
    setores : ISetorDTO[]

}