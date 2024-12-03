import { IProfile } from "../interfaces/profile.interface";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export interface ISetorDTO {
    id : string;
    nome : string;
    unidade: UnidadeOrcamentariaDTO;
    membros : IProfile[];
}