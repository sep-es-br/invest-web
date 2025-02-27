import { ISetorDTO } from "./SetorDTO"

export interface IPapelDTO {
    id : string,
    guid : string,
    nome : string,
    agenteSub : string,
    agenteNome : string,
    setor : ISetorDTO,
    prioritario : boolean,

    
}

export const papelTodos : IPapelDTO = {
    id: undefined,
    guid: "todos",
    nome: undefined,
    agenteSub: undefined,
    agenteNome: "Todos",
    setor: undefined,
    prioritario: undefined
}