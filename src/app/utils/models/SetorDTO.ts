import { IProfile } from "../interfaces/profile.interface";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export interface ISetorDTO {
    id : string;
    guid : string;
    nome : string;
    sigla : string;
    unidade: UnidadeOrcamentariaDTO;
    membros : IProfile[];
}