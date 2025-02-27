import { IProfile } from "../interfaces/profile.interface";
import { IOrgaoDTO } from "./OrgaoDTO";
import { IPapelDTO } from "./PapelDto";
import { IPodeDTO } from "./PodeDto";
import { ISetorDTO } from "./SetorDTO";

export interface GrupoDTO {
    id? : string;
    icone : string;
    sigla : string;
    nome : string;
    descricao : string;
    
    membros : IProfile[];
    papeisMembro : IPapelDTO[];
    setoresMembros : ISetorDTO[];
    orgaoMembro : IOrgaoDTO[];

    permissoes : IPodeDTO[];

}