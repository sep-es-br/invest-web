import { IProfile } from "../interfaces/profile.interface";
import { IOrgaoDTO } from "./OrgaoDTO";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export interface ISetorDTO {
    id : number;
    guid : string;
    nome : string;
    sigla : string;
    orgao: IOrgaoDTO;
}

export const setorTodos : ISetorDTO = {
    id: undefined,
    guid: "todos",
    nome: "Todos",
    orgao: undefined,
    sigla: undefined
}