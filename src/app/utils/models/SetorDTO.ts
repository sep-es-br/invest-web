import { IProfile } from "../interfaces/profile.interface";
import { IOrgaoDTO } from "./OrgaoDTO";
import { UnidadeOrcamentariaDTO } from "./UnidadeOrcamentariaDTO";

export interface ISetorDTO {
    id : string;
    guid : string;
    nome : string;
    sigla : string;
    orgao: IOrgaoDTO;
}