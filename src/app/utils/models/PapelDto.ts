export interface IPapelDTO {
    id : string,
    guid : string,
    nome : string,
    agenteSub : string,
    agenteNome : string
}

export const papelTodos : IPapelDTO = {
    id: null,
    guid: "todos",
    nome: "Todos",
    agenteSub: null,
    agenteNome: null
}