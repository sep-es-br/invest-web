import { ISetorDTO } from "./SetorDTO"

export interface IOrgaoDTO {
    id : string,
    guid : string,
    sigla : string,
    nome : string
}

export const todosOrgao : IOrgaoDTO = {
    id: undefined,
    guid: "todos",
    nome: "Todos",
    sigla: undefined

}