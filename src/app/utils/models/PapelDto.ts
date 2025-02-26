export interface IPapelDTO {
    id : string,
    guid : string,
    nome : string,
    agenteSub : string,
    agenteNome : string
}

export const papelTodos : IPapelDTO = {
    id: undefined,
    guid: "todos",
    nome: undefined,
    agenteSub: undefined,
    agenteNome: "Todos"
}